-- Add prediction feedback table for tracking model accuracy
-- This tracks whether predictions were accurate after the predicted date

CREATE TABLE IF NOT EXISTS public.lpg_prediction_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  prediction_id UUID NOT NULL REFERENCES public.lpg_predictions(id) ON DELETE CASCADE,
  cylinder_id UUID NOT NULL REFERENCES public.lpg_cylinders(id) ON DELETE CASCADE,
  
  -- Original prediction data
  predicted_empty_days INTEGER NOT NULL,
  predicted_empty_date DATE NOT NULL,
  predicted_daily_avg_kg NUMERIC(10, 2) NOT NULL,
  
  -- Actual data when user provides feedback
  actual_empty_date DATE,
  actual_days_difference INTEGER,
  
  -- User feedback
  was_accurate BOOLEAN,
  feedback_message TEXT,
  accuracy_percentage NUMERIC(5, 2),
  
  -- Status
  feedback_provided_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index for efficient queries
CREATE INDEX IF NOT EXISTS idx_lpg_prediction_feedback_user_id ON public.lpg_prediction_feedback(user_id);
CREATE INDEX IF NOT EXISTS idx_lpg_prediction_feedback_prediction_id ON public.lpg_prediction_feedback(prediction_id);
CREATE INDEX IF NOT EXISTS idx_lpg_prediction_feedback_was_accurate ON public.lpg_prediction_feedback(was_accurate);

-- Enable RLS
ALTER TABLE public.lpg_prediction_feedback ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own prediction feedback" ON public.lpg_prediction_feedback
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own feedback" ON public.lpg_prediction_feedback
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own feedback" ON public.lpg_prediction_feedback
  FOR UPDATE USING (auth.uid() = user_id);

-- Add model accuracy metrics table
CREATE TABLE IF NOT EXISTS public.lpg_model_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  metric_date DATE NOT NULL,
  
  total_predictions INTEGER DEFAULT 0,
  accurate_predictions INTEGER DEFAULT 0,
  inaccurate_predictions INTEGER DEFAULT 0,
  
  average_error_days NUMERIC(10, 2),
  average_accuracy_percentage NUMERIC(5, 2),
  
  mae_mean_absolute_error NUMERIC(10, 2),
  rmse_root_mean_squared_error NUMERIC(10, 2),
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  
  CONSTRAINT unique_metric_date UNIQUE(metric_date)
);

-- Index for queries
CREATE INDEX IF NOT EXISTS idx_lpg_model_metrics_date ON public.lpg_model_metrics(metric_date);

-- Comment explaining the purpose
COMMENT ON TABLE public.lpg_prediction_feedback IS 
  'Tracks user feedback on LPG prediction accuracy. Users can verify if predictions were correct to help train the model.';

COMMENT ON TABLE public.lpg_model_metrics IS 
  'Aggregated model performance metrics calculated from feedback data. Used to track ML model improvement over time.';

COMMENT ON COLUMN public.lpg_prediction_feedback.was_accurate IS 
  'TRUE if prediction was accurate within acceptable range, FALSE otherwise, NULL if pending feedback';

COMMENT ON COLUMN public.lpg_prediction_feedback.actual_days_difference IS 
  'Difference between predicted days and actual days. Positive = predicted before actual, Negative = predicted after actual';

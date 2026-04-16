-- Seed test LPG data for demonstration and testing
-- This script creates test cylinders, daily usage records, and predictions for test users

-- Users we're adding data for (from tempUserStore)
-- consumer@test.com
-- provider@test.com
-- john@test.com

-- Clear existing test data (optional - comment out if you want to keep data)
-- DELETE FROM public.lpg_alerts WHERE user_id IN (SELECT user_id FROM temp_test_users);
-- DELETE FROM public.lpg_predictions WHERE user_id IN (SELECT user_id FROM temp_test_users);
-- DELETE FROM public.lpg_daily_usage WHERE user_id IN (SELECT user_id FROM temp_test_users);
-- DELETE FROM public.lpg_cylinders WHERE user_id IN (SELECT user_id FROM temp_test_users);

-- Test user IDs (match tempUserStore.js)
DO $$
DECLARE
  consumer_id UUID := '550e8400-e29b-41d4-a716-446655440001'::UUID;
  provider_id UUID := '550e8400-e29b-41d4-a716-446655440002'::UUID;
  john_id UUID := '550e8400-e29b-41d4-a716-446655440004'::UUID;
  cylinder_1_id UUID;
  cylinder_2_id UUID;
  cylinder_3_id UUID;
BEGIN

  -- =====================================================
  -- TEST DATA FOR CONSUMER@TEST.COM
  -- =====================================================
  
  -- Add Cylinder 1 - Active cylinder with low gas (will trigger alert soon)
  INSERT INTO public.lpg_cylinders (
    user_id, cylinder_id, current_weight_kg, max_capacity_kg, 
    status, refill_frequency_days, notes
  ) VALUES (
    consumer_id, 'CYL-001-TEST', 3.5, 20.0, 
    'active', 30, 'Test cylinder for demo - Low gas level'
  ) RETURNING id INTO cylinder_1_id;

  -- Add Cylinder 2 - Recent refill
  INSERT INTO public.lpg_cylinders (
    user_id, cylinder_id, current_weight_kg, max_capacity_kg, 
    status, refill_frequency_days, notes
  ) VALUES (
    consumer_id, 'CYL-002-TEST', 18.5, 20.0, 
    'active', 30, 'Test cylinder - Recently refilled'
  ) RETURNING id INTO cylinder_2_id;

  -- =====================================================
  -- ADD DAILY USAGE DATA FOR CYLINDER 1 (30 days history)
  -- This helps in calculating accurate average usage
  -- =====================================================
  
  INSERT INTO public.lpg_daily_usage (user_id, cylinder_id, usage_date, usage_kg, usage_reason)
  VALUES 
    (consumer_id, cylinder_1_id, CURRENT_DATE - INTERVAL '30 days', 0.45, 'cooking'),
    (consumer_id, cylinder_1_id, CURRENT_DATE - INTERVAL '29 days', 0.52, 'cooking'),
    (consumer_id, cylinder_1_id, CURRENT_DATE - INTERVAL '28 days', 0.48, 'cooking'),
    (consumer_id, cylinder_1_id, CURRENT_DATE - INTERVAL '27 days', 0.55, 'cooking'),
    (consumer_id, cylinder_1_id, CURRENT_DATE - INTERVAL '26 days', 0.50, 'cooking'),
    (consumer_id, cylinder_1_id, CURRENT_DATE - INTERVAL '25 days', 0.58, 'heating'),
    (consumer_id, cylinder_1_id, CURRENT_DATE - INTERVAL '24 days', 0.49, 'cooking'),
    (consumer_id, cylinder_1_id, CURRENT_DATE - INTERVAL '23 days', 0.53, 'cooking'),
    (consumer_id, cylinder_1_id, CURRENT_DATE - INTERVAL '22 days', 0.46, 'cooking'),
    (consumer_id, cylinder_1_id, CURRENT_DATE - INTERVAL '21 days', 0.51, 'heating'),
    (consumer_id, cylinder_1_id, CURRENT_DATE - INTERVAL '20 days', 0.54, 'cooking'),
    (consumer_id, cylinder_1_id, CURRENT_DATE - INTERVAL '19 days', 0.47, 'cooking'),
    (consumer_id, cylinder_1_id, CURRENT_DATE - INTERVAL '18 days', 0.52, 'cooking'),
    (consumer_id, cylinder_1_id, CURRENT_DATE - INTERVAL '17 days', 0.50, 'cooking'),
    (consumer_id, cylinder_1_id, CURRENT_DATE - INTERVAL '16 days', 0.55, 'heating'),
    (consumer_id, cylinder_1_id, CURRENT_DATE - INTERVAL '15 days', 0.49, 'cooking'),
    (consumer_id, cylinder_1_id, CURRENT_DATE - INTERVAL '14 days', 0.53, 'cooking'),
    (consumer_id, cylinder_1_id, CURRENT_DATE - INTERVAL '13 days', 0.48, 'cooking'),
    (consumer_id, cylinder_1_id, CURRENT_DATE - INTERVAL '12 days', 0.56, 'heating'),
    (consumer_id, cylinder_1_id, CURRENT_DATE - INTERVAL '11 days', 0.51, 'cooking'),
    (consumer_id, cylinder_1_id, CURRENT_DATE - INTERVAL '10 days', 0.54, 'cooking'),
    (consumer_id, cylinder_1_id, CURRENT_DATE - INTERVAL '9 days', 0.47, 'cooking'),
    (consumer_id, cylinder_1_id, CURRENT_DATE - INTERVAL '8 days', 0.52, 'cooking'),
    (consumer_id, cylinder_1_id, CURRENT_DATE - INTERVAL '7 days', 0.50, 'cooking'),
    (consumer_id, cylinder_1_id, CURRENT_DATE - INTERVAL '6 days', 0.55, 'heating'),
    (consumer_id, cylinder_1_id, CURRENT_DATE - INTERVAL '5 days', 0.49, 'cooking'),
    (consumer_id, cylinder_1_id, CURRENT_DATE - INTERVAL '4 days', 0.53, 'cooking'),
    (consumer_id, cylinder_1_id, CURRENT_DATE - INTERVAL '3 days', 0.48, 'cooking'),
    (consumer_id, cylinder_1_id, CURRENT_DATE - INTERVAL '2 days', 0.51, 'cooking'),
    (consumer_id, cylinder_1_id, CURRENT_DATE - INTERVAL '1 day', 0.54, 'cooking');

  -- =====================================================
  -- ADD DAILY USAGE DATA FOR CYLINDER 2 (15 days history)
  -- =====================================================
  
  INSERT INTO public.lpg_daily_usage (user_id, cylinder_id, usage_date, usage_kg, usage_reason)
  VALUES 
    (consumer_id, cylinder_2_id, CURRENT_DATE - INTERVAL '15 days', 0.35, 'cooking'),
    (consumer_id, cylinder_2_id, CURRENT_DATE - INTERVAL '14 days', 0.38, 'cooking'),
    (consumer_id, cylinder_2_id, CURRENT_DATE - INTERVAL '13 days', 0.36, 'cooking'),
    (consumer_id, cylinder_2_id, CURRENT_DATE - INTERVAL '12 days', 0.40, 'heating'),
    (consumer_id, cylinder_2_id, CURRENT_DATE - INTERVAL '11 days', 0.37, 'cooking'),
    (consumer_id, cylinder_2_id, CURRENT_DATE - INTERVAL '10 days', 0.39, 'cooking'),
    (consumer_id, cylinder_2_id, CURRENT_DATE - INTERVAL '9 days', 0.36, 'cooking'),
    (consumer_id, cylinder_2_id, CURRENT_DATE - INTERVAL '8 days', 0.38, 'cooking'),
    (consumer_id, cylinder_2_id, CURRENT_DATE - INTERVAL '7 days', 0.35, 'cooking'),
    (consumer_id, cylinder_2_id, CURRENT_DATE - INTERVAL '6 days', 0.40, 'heating'),
    (consumer_id, cylinder_2_id, CURRENT_DATE - INTERVAL '5 days', 0.37, 'cooking'),
    (consumer_id, cylinder_2_id, CURRENT_DATE - INTERVAL '4 days', 0.39, 'cooking'),
    (consumer_id, cylinder_2_id, CURRENT_DATE - INTERVAL '3 days', 0.36, 'cooking'),
    (consumer_id, cylinder_2_id, CURRENT_DATE - INTERVAL '2 days', 0.38, 'cooking'),
    (consumer_id, cylinder_2_id, CURRENT_DATE - INTERVAL '1 day', 0.35, 'cooking');

  -- =====================================================
  -- CREATE PREDICTIONS FOR TEST DATA
  -- =====================================================
  
  -- Prediction for Cylinder 1 (low gas - should trigger alert)
  -- Average usage: ~0.51 kg/day, Current weight: 3.5 kg
  -- Days remaining: 3.5 / 0.51 ≈ 6.86 days (will trigger alert!)
  INSERT INTO public.lpg_predictions (
    user_id, cylinder_id, current_weight_kg, daily_avg_usage_kg,
    predicted_empty_days, predicted_empty_date, confidence_score, alert_status
  ) VALUES (
    consumer_id, cylinder_1_id, 3.5, 0.51,
    7, CURRENT_DATE + INTERVAL '7 days', 0.92, true
  );

  -- Prediction for Cylinder 2 (good stock)
  -- Average usage: ~0.37 kg/day, Current weight: 18.5 kg
  -- Days remaining: 18.5 / 0.37 ≈ 50 days
  INSERT INTO public.lpg_predictions (
    user_id, cylinder_id, current_weight_kg, daily_avg_usage_kg,
    predicted_empty_days, predicted_empty_date, confidence_score, alert_status
  ) VALUES (
    consumer_id, cylinder_2_id, 18.5, 0.37,
    50, CURRENT_DATE + INTERVAL '50 days', 0.88, false
  );

  -- =====================================================
  -- CREATE ALERTS FOR CYLINDER 1
  -- =====================================================
  
  INSERT INTO public.lpg_alerts (user_id, cylinder_id, alert_type, message, is_read)
  VALUES (
    consumer_id, cylinder_1_id, 'low_stock',
    'Your LPG cylinder CYL-001-TEST will be empty in approximately 7 days. Current level: 3.5 kg. Please schedule a refill soon!',
    false
  );

  INSERT INTO public.lpg_alerts (user_id, cylinder_id, alert_type, message, is_read)
  VALUES (
    consumer_id, cylinder_1_id, 'prediction_reminder',
    'Reminder: You should refill your cylinder in the next 3-4 days based on your usage pattern.',
    false
  );

  -- =====================================================
  -- SET ALERT CONFIG
  -- =====================================================
  
  INSERT INTO public.lpg_alert_config (user_id, alert_threshold_days, alert_enabled, notification_methods)
  VALUES (consumer_id, 7, true, ARRAY['email', 'in_app'])
  ON CONFLICT (user_id) DO UPDATE SET
    alert_threshold_days = 7,
    alert_enabled = true,
    notification_methods = ARRAY['email', 'in_app'];

  -- =====================================================
  -- TEST DATA FOR PROVIDER@TEST.COM (Single Cylinder)
  -- =====================================================
  
  INSERT INTO public.lpg_cylinders (
    user_id, cylinder_id, current_weight_kg, max_capacity_kg, 
    status, refill_frequency_days, notes
  ) VALUES (
    provider_id, 'CYL-PRV-001', 15.0, 20.0, 
    'active', 25, 'Provider test cylinder'
  ) RETURNING id INTO cylinder_3_id;

  -- Add some usage data
  INSERT INTO public.lpg_daily_usage (user_id, cylinder_id, usage_date, usage_kg, usage_reason)
  VALUES 
    (provider_id, cylinder_3_id, CURRENT_DATE - INTERVAL '10 days', 0.42, 'business'),
    (provider_id, cylinder_3_id, CURRENT_DATE - INTERVAL '9 days', 0.45, 'business'),
    (provider_id, cylinder_3_id, CURRENT_DATE - INTERVAL '8 days', 0.40, 'business'),
    (provider_id, cylinder_3_id, CURRENT_DATE - INTERVAL '7 days', 0.44, 'business'),
    (provider_id, cylinder_3_id, CURRENT_DATE - INTERVAL '6 days', 0.43, 'business'),
    (provider_id, cylinder_3_id, CURRENT_DATE - INTERVAL '5 days', 0.41, 'business'),
    (provider_id, cylinder_3_id, CURRENT_DATE - INTERVAL '4 days', 0.45, 'business'),
    (provider_id, cylinder_3_id, CURRENT_DATE - INTERVAL '3 days', 0.42, 'business'),
    (provider_id, cylinder_3_id, CURRENT_DATE - INTERVAL '2 days', 0.44, 'business'),
    (provider_id, cylinder_3_id, CURRENT_DATE - INTERVAL '1 day', 0.43, 'business');

  -- Prediction for provider
  INSERT INTO public.lpg_predictions (
    user_id, cylinder_id, current_weight_kg, daily_avg_usage_kg,
    predicted_empty_days, predicted_empty_date, confidence_score, alert_status
  ) VALUES (
    provider_id, cylinder_3_id, 15.0, 0.43,
    35, CURRENT_DATE + INTERVAL '35 days', 0.89, false
  );

  INSERT INTO public.lpg_alert_config (user_id, alert_threshold_days, alert_enabled, notification_methods)
  VALUES (provider_id, 7, true, ARRAY['email', 'in_app'])
  ON CONFLICT (user_id) DO UPDATE SET
    alert_threshold_days = 7,
    alert_enabled = true,
    notification_methods = ARRAY['email', 'in_app'];

  RAISE NOTICE 'Test data seeded successfully!';
  RAISE NOTICE 'Consumer cylinders: CYL-001-TEST (3.5kg - LOW), CYL-002-TEST (18.5kg - GOOD)';
  RAISE NOTICE 'Provider cylinders: CYL-PRV-001 (15.0kg)';
  RAISE NOTICE 'Alerts created for low stock cylinder';

END $$;

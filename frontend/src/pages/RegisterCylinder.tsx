import { useState } from 'react';
import { 
  Box, 
  VStack, 
  Heading, 
  Text, 
  Input as ChakraInput, 
  RadioGroup, 
  Stack, 
  Badge,
} from '@chakra-ui/react';
import { Button } from '@/components/ui/button';
import { UploadBox } from '@/components/UploadBox';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';

export default function RegisterCylinder() {
  const [step, setStep] = useState(1);
  const [aadhaar, setAadhaar] = useState('');
  const [agency, setAgency] = useState('');
  const [availability, setAvailability] = useState('yes');
  const [quantity, setQuantity] = useState('1');
  const [file, setFile] = useState<File | null>(null);
  
  const navigate = useNavigate();

  const handleNext = () => setStep(step + 1);
  
  const handleSubmit = () => {
    // Note: useToast is deprecated in v3, we'd normally use a toaster snippet.
    // Simplifying for now to focus on the RadioGroup error.
    console.log("Registration Submitted");
    setStep(3); // Completed step
  };

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-12 flex items-center justify-center font-sans">
      <div className="max-w-xl w-full">
        <button 
          onClick={() => step === 3 ? navigate('/dashboard') : setStep(Math.max(1, step - 1))}
          className="mb-8 flex items-center gap-2 text-gray-500 hover:text-white transition-colors text-sm"
        >
          <ArrowLeft className="w-4 h-4" /> 
          {step === 3 ? 'Go to Dashboard' : 'Back'}
        </button>

        <Box className="liquid-glass border border-white/10 rounded-3xl p-8 md:p-10 shadow-2xl">
          {step === 1 && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <VStack align="flex-start" gap={6}>
                <div>
                  <Heading size="lg" fontWeight="300" color="white" mb={2}>Registration</Heading>
                  <Text color="whiteAlpha.600" fontSize="sm">Step 1 of 2: Basic Details</Text>
                </div>
                
                <Box w="full">
                  <Text color="whiteAlpha.700" fontSize="xs" mb={2}>Aadhaar Number (12-digit)</Text>
                   {/* Centering labe for soft look? No, standard layout is better for stress use */}
                  <ChakraInput 
                    placeholder="0000 0000 0000" 
                    bg="whiteAlpha.50" 
                    border="1px solid" 
                    borderColor="whiteAlpha.100" 
                    color="white"
                    _hover={{ borderColor: 'whiteAlpha.300' }}
                    _focus={{ borderColor: 'whiteAlpha.500', boxShadow: 'none' }}
                    value={aadhaar}
                    onChange={(e) => setAadhaar(e.target.value)}
                  />
                </Box>

                <Box w="full">
                  <Text color="whiteAlpha.700" fontSize="xs" mb={2}>Gas Agency Name</Text>
                  <ChakraInput 
                    placeholder="e.g. Bharat Gas, HP Gas" 
                    bg="whiteAlpha.50" 
                    border="1px solid" 
                    borderColor="whiteAlpha.100" 
                    color="white"
                    _hover={{ borderColor: 'whiteAlpha.300' }}
                    _focus={{ borderColor: 'whiteAlpha.500', boxShadow: 'none' }}
                    value={agency}
                    onChange={(e) => setAgency(e.target.value)}
                  />
                </Box>

                <Box w="full">
                  <Text color="whiteAlpha.700" fontSize="xs" mb={2}>Currently Available to Share?</Text>
                  <RadioGroup.Root onValueChange={(e) => setAvailability(e.value)} value={availability}>
                    <Stack direction="row" gap={8} mt={2}>
                      <RadioGroup.Item value="yes">
                        <RadioGroup.ItemControl />
                        <RadioGroup.ItemText>
                           <span style={{ color: 'white' }}>Yes</span>
                        </RadioGroup.ItemText>
                        <RadioGroup.ItemHiddenInput />
                      </RadioGroup.Item>
                      <RadioGroup.Item value="no">
                        <RadioGroup.ItemControl />
                        <RadioGroup.ItemText>
                           <span style={{ color: 'white' }}>No</span>
                        </RadioGroup.ItemText>
                        <RadioGroup.ItemHiddenInput />
                      </RadioGroup.Item>
                    </Stack>
                  </RadioGroup.Root>
                </Box>

                <Button className="w-full h-12 mt-4" onClick={handleNext} disabled={!aadhaar || !agency}>
                  Continue
                </Button>
              </VStack>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <VStack align="flex-start" gap={6}>
                <div>
                  <Heading size="lg" fontWeight="300" color="white" mb={2}>Verification</Heading>
                  <Text color="whiteAlpha.600" fontSize="sm">Step 2 of 2: Upload Proof</Text>
                </div>
                
                <VStack w="full" align="flex-start" gap={4}>
                  <Text color="whiteAlpha.800" fontSize="sm">Upload Cylinder Book or Identity Proof</Text>
                  <UploadBox onFileSelect={setFile} />
                </VStack>

                <Text fontSize="xs" color="whiteAlpha.500">
                  By submitting, you agree to our safety guidelines and consent to identity verification for peer-to-peer sharing.
                </Text>

                <Button className="w-full h-12 mt-4" onClick={handleSubmit} disabled={!file}>
                  Submit for Approval
                </Button>
              </VStack>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
              <VStack gap={8} py={4} align="center" textAlign="center">
                <Box className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center border border-green-500/30">
                  <CheckCircle2 className="w-10 h-10 text-green-400" />
                </Box>
                <div>
                  <Heading size="md" fontWeight="400" color="white" mb={3}>Request Submitted</Heading>
                  <Text color="whiteAlpha.600" fontSize="sm" lineHeight="tall">
                    Your details are being reviewed by our team. You'll be notified once your profile is verified and visible on the map.
                  </Text>
                </div>
                <div className="w-full pt-4 space-y-3">
                  <Badge className="bg-white/5 border-white/10 text-white font-light px-4 py-2 rounded-lg">
                    Status: Pending Verification
                  </Badge>
                  <Button variant="outline" className="w-full" onClick={() => navigate('/dashboard')}>
                    Return to Dashboard
                  </Button>
                </div>
              </VStack>
            </motion.div>
          )}
        </Box>
      </div>
    </div>
  );
}

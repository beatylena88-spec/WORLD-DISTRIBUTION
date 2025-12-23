import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Upload, FileText } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

export default function QuotePage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    productName: '',
    specifications: '',
    volume: '',
    deliveryDate: '',
    deliveryAddress: '',
    additionalNotes: ''
  });

  const handleSubmit = async () => {
    // Simulate quote submission
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast.success('Quote request submitted!', {
      description: 'Our team will contact you within 24 hours'
    });
    
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#1A1A1D] noise-texture">
      <header className="bg-[#1A1A1D] border-b border-[#F5F1E8]/10 grid-pattern">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <Link to="/dashboard">
            <Button variant="outline" className="border-[#F5F1E8]/20 text-[#F5F1E8] hover:bg-[#F5F1E8]/10">
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="flex items-center gap-4 mb-4">
            <FileText className="w-12 h-12 text-[#06FFA5]" />
            <div>
              <h1 className="text-display text-5xl text-[#F5F1E8]">
                Request Custom Quote
              </h1>
              <p className="text-mono text-lg text-[#F5F1E8]/70 mt-2">
                Multi-step form for bulk orders with custom specifications
              </p>
            </div>
          </div>
        </motion.div>

        {/* Progress Indicator */}
        <div className="flex items-center gap-2 mb-12 mt-8">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center flex-1">
              <div className={`h-2 rounded-full flex-1 transition-all ${
                step >= s ? 'bg-[#06FFA5]' : 'bg-[#F5F1E8]/20'
              }`} />
            </div>
          ))}
        </div>

        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-[#F5F1E8] rounded-xl p-8"
        >
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-display text-2xl text-[#1A1A1D] mb-2">
                  Step 1: Product Specifications
                </h2>
                <p className="text-mono text-sm text-[#1A1A1D]/60">
                  Describe the product you need
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="productName" className="text-mono text-[#1A1A1D]">
                    Product Name
                  </Label>
                  <Input
                    id="productName"
                    placeholder="e.g., Organic Quinoa"
                    value={formData.productName}
                    onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                    className="text-mono bg-white border-[#003049]/20"
                  />
                </div>

                <div>
                  <Label htmlFor="specifications" className="text-mono text-[#1A1A1D]">
                    Detailed Specifications
                  </Label>
                  <Textarea
                    id="specifications"
                    placeholder="Describe product requirements, quality standards, certifications needed..."
                    value={formData.specifications}
                    onChange={(e) => setFormData({ ...formData, specifications: e.target.value })}
                    className="text-mono bg-white border-[#003049]/20 min-h-32"
                  />
                </div>

                <div>
                  <Label className="text-mono text-[#1A1A1D] mb-2 block">
                    Upload Specification Files (Optional)
                  </Label>
                  <div className="border-2 border-dashed border-[#003049]/20 rounded-lg p-8 text-center hover:border-[#003049]/40 transition-colors cursor-pointer">
                    <Upload className="w-12 h-12 text-[#003049]/40 mx-auto mb-3" />
                    <p className="text-mono text-sm text-[#1A1A1D]/60">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-mono text-xs text-[#1A1A1D]/40 mt-1">
                      PDF, DOC, or images up to 10MB
                    </p>
                  </div>
                </div>
              </div>

              <Button 
                onClick={() => setStep(2)}
                className="w-full bg-[#003049] hover:bg-[#003049]/90 text-[#F5F1E8] font-bold py-6"
                disabled={!formData.productName || !formData.specifications}
              >
                Continue to Volume Requirements
              </Button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-display text-2xl text-[#1A1A1D] mb-2">
                  Step 2: Volume Requirements
                </h2>
                <p className="text-mono text-sm text-[#1A1A1D]/60">
                  Specify quantity needed
                </p>
              </div>

              <div>
                <Label htmlFor="volume" className="text-mono text-[#1A1A1D]">
                  Required Volume
                </Label>
                <Input
                  id="volume"
                  placeholder="e.g., 5000kg per month"
                  value={formData.volume}
                  onChange={(e) => setFormData({ ...formData, volume: e.target.value })}
                  className="text-mono bg-white border-[#003049]/20"
                />
              </div>

              <div className="flex gap-4">
                <Button 
                  onClick={() => setStep(1)}
                  variant="outline"
                  className="flex-1 border-[#003049]/20 text-[#1A1A1D]"
                >
                  Back
                </Button>
                <Button 
                  onClick={() => setStep(3)}
                  className="flex-1 bg-[#003049] hover:bg-[#003049]/90 text-[#F5F1E8] font-bold py-6"
                  disabled={!formData.volume}
                >
                  Continue to Delivery Details
                </Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-display text-2xl text-[#1A1A1D] mb-2">
                  Step 3: Delivery Details
                </h2>
                <p className="text-mono text-sm text-[#1A1A1D]/60">
                  Where and when do you need it?
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="deliveryDate" className="text-mono text-[#1A1A1D]">
                    Preferred Delivery Date
                  </Label>
                  <Input
                    id="deliveryDate"
                    type="date"
                    value={formData.deliveryDate}
                    onChange={(e) => setFormData({ ...formData, deliveryDate: e.target.value })}
                    className="text-mono bg-white border-[#003049]/20"
                  />
                </div>

                <div>
                  <Label htmlFor="deliveryAddress" className="text-mono text-[#1A1A1D]">
                    Delivery Address
                  </Label>
                  <Textarea
                    id="deliveryAddress"
                    placeholder="Full delivery address including warehouse details..."
                    value={formData.deliveryAddress}
                    onChange={(e) => setFormData({ ...formData, deliveryAddress: e.target.value })}
                    className="text-mono bg-white border-[#003049]/20"
                  />
                </div>

                <div>
                  <Label htmlFor="additionalNotes" className="text-mono text-[#1A1A1D]">
                    Additional Notes (Optional)
                  </Label>
                  <Textarea
                    id="additionalNotes"
                    placeholder="Any special requirements or questions..."
                    value={formData.additionalNotes}
                    onChange={(e) => setFormData({ ...formData, additionalNotes: e.target.value })}
                    className="text-mono bg-white border-[#003049]/20"
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <Button 
                  onClick={() => setStep(2)}
                  variant="outline"
                  className="flex-1 border-[#003049]/20 text-[#1A1A1D]"
                >
                  Back
                </Button>
                <Button 
                  onClick={handleSubmit}
                  className="flex-1 bg-[#06FFA5] hover:bg-[#06FFA5]/90 text-[#1A1A1D] font-bold py-6"
                  disabled={!formData.deliveryDate || !formData.deliveryAddress}
                >
                  Submit Quote Request
                </Button>
              </div>
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
}

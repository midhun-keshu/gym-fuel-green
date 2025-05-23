
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { ArrowLeftIcon } from "lucide-react";

type ForgotPasswordStep = 'phone' | 'otp' | 'new-password';

const ForgotPassword: React.FC = () => {
  const { toast } = useToast();
  const [step, setStep] = useState<ForgotPasswordStep>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState('');

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Format phone number if needed
      const formattedPhone = phoneNumber.startsWith('+') ? phoneNumber : `+${phoneNumber}`;
      
      // Check if the phone number exists in the profiles table
      const { data, error } = await supabase
        .from('profiles')
        .select('phone_number')
        .eq('phone_number', formattedPhone)
        .single();
      
      if (error || !data) {
        toast({
          title: "Phone number not found",
          description: "This phone number isn't registered in our system.",
          variant: "destructive",
        });
      } else {
        // Generate a 6-digit OTP
        const generatedCode = Math.floor(100000 + Math.random() * 900000).toString();
        setGeneratedOtp(generatedCode);

        // In a real app, this would send an SMS with OTP
        // For demo purposes, we'll show the OTP in a toast
        toast({
          title: "OTP Generated",
          description: `For demonstration purposes, use this OTP: ${generatedCode}`,
        });
        
        setStep('otp');
      }
    } catch (error) {
      console.error('Error sending OTP:', error);
      toast({
        title: "Error",
        description: "Failed to send verification code. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate the OTP against what was generated
    if (otp === generatedOtp) {
      toast({
        title: "OTP Verified",
        description: "Your code has been verified. Please set a new password.",
      });
      setStep('new-password');
    } else {
      toast({
        title: "Invalid Code",
        description: "The verification code is incorrect. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (newPassword !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure both passwords match.",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    if (newPassword.length < 8) {
      toast({
        title: "Password too short",
        description: "Password should be at least 8 characters long.",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    try {
      // Look up the user by phone number
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('phone_number', phoneNumber.startsWith('+') ? phoneNumber : `+${phoneNumber}`)
        .single();

      if (profileError || !profileData) {
        throw new Error('Could not find user profile');
      }

      // Use Supabase auth update user API to update the password
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (updateError) {
        throw updateError;
      }
      
      toast({
        title: "Password Updated",
        description: "Your password has been reset successfully. You can now login with your new password.",
      });
      
      // Reset the form and go back to phone step
      setPhoneNumber('');
      setOtp('');
      setNewPassword('');
      setConfirmPassword('');
      setStep('phone');
      
    } catch (error) {
      console.error('Error resetting password:', error);
      toast({
        title: "Error",
        description: "Failed to reset your password. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (step) {
      case 'phone':
        return (
          <form onSubmit={handlePhoneSubmit}>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  placeholder="+1234567890"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Sending Code..." : "Send Verification Code"}
              </Button>
            </div>
          </form>
        );
      
      case 'otp':
        return (
          <form onSubmit={handleOtpSubmit}>
            <div className="grid gap-4">
              <div className="grid gap-2 text-center">
                <Label htmlFor="otp">Enter Verification Code</Label>
                <p className="text-sm text-muted-foreground">
                  We've sent a 6-digit code to {phoneNumber}
                </p>
                <div className="flex justify-center py-4">
                  <InputOTP 
                    maxLength={6} 
                    value={otp} 
                    onChange={setOtp}
                    render={({ slots }) => (
                      <InputOTPGroup>
                        {slots.map((slot, index) => (
                          <InputOTPSlot key={index} {...slot} index={index} />
                        ))}
                      </InputOTPGroup>
                    )}
                  />
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={otp.length !== 6}>
                Verify Code
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                className="w-full"
                onClick={() => setStep('phone')}
              >
                <ArrowLeftIcon className="h-4 w-4 mr-2" />
                Back
              </Button>
            </div>
          </form>
        );
      
      case 'new-password':
        return (
          <form onSubmit={handlePasswordSubmit}>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input
                  id="new-password"
                  type="password"
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  minLength={8}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Updating Password..." : "Reset Password"}
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                className="w-full"
                onClick={() => setStep('otp')}
              >
                <ArrowLeftIcon className="h-4 w-4 mr-2" />
                Back
              </Button>
            </div>
          </form>
        );
    }
  };

  return (
    <Card className="max-w-md w-full mx-auto">
      <CardHeader>
        <CardTitle>Reset Your Password</CardTitle>
        <CardDescription>
          {step === 'phone' && "Enter your phone number to receive a verification code."}
          {step === 'otp' && "Enter the verification code sent to your phone."}
          {step === 'new-password' && "Create a new password for your account."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {renderStepContent()}
      </CardContent>
      <CardFooter className="flex flex-col space-y-4">
        <div className="text-sm text-center text-muted-foreground">
          Remember your password? <a href="/login" className="text-gym-600 hover:underline">Log in</a>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ForgotPassword;

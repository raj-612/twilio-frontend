import React, { useState } from 'react';
import axios from 'axios';
import { isValidPhoneNumber } from 'libphonenumber-js';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { Input } from './ui/input';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp';
import { Button } from '@/components/ui/button';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';


const OtpVerification: React.FC = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [opt, setOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [showError, setShowError] = useState(false);
  const hash = 't4ICRhK8AQFwL5W4TF2v'; // Hardcoded hash

  const handleSendOtp = async () => {
    if (isValidPhoneNumber(phoneNumber)) {
      try {
        await axios.post('https://api.aestheticrecord.com/api/send-otp', {
          hash,
          phone_number: phoneNumber,
        });
        setShowError(false); 
        setIsOtpSent(true);
      } catch (error) {
        console.error('Error sending OTP:', error);
      }
    } else {
      setShowError(true);
    }
  };

  const handleVerifyOtp = async () => {
    try {
      await axios.post('https://api.aestheticrecord.com/api/verify-opt', {
        hash,
        phone_number: phoneNumber,
        opt,
      });
      alert('OTP verified successfully');
    } catch (error) {
      console.error('Error verifying OTP:', error);
    }
  };


  return (
    <div className="flex justify-center">
      <div className="mt-10 p-6 bg-white rounded-lg shadow-md w-96">
      {showError && (
          <Alert variant="destructive" className="mb-4">
            <AlertTitle>Invalid Phone Number</AlertTitle>
            <AlertDescription>
              Please enter a valid phone number to send the OTP.
            </AlertDescription>
          </Alert>
        )}
        <div className="mb-6">
          <PhoneInput
            value={phoneNumber}
            onChange={(value) => setPhoneNumber(value || '')}
            placeholder="Enter phone number"
            defaultCountry="US"
            inputComponent={Input}
            className="flex gap-2 w-5/6"
          />
        </div>
        <div className="mb-6">
          <InputOTP maxLength={6} className="flex justify-center gap-2" disabled={!isOtpSent} onChange={(value)=>setOtp(value)}>
            <InputOTPGroup className='flex gap-2'>
              {Array.from({ length: 6 }).map((_, index) => (
                <InputOTPSlot
                  key={index}
                  index={index}
                  className="w-10 h-10 text-center border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-400"
                />
              ))}
            </InputOTPGroup>
          </InputOTP>
        </div>
        <div className="flex space-x-4">
          <Button onClick={handleSendOtp} className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700">
            {isOtpSent ? 'Resend OTP' : 'Send OTP'}
          </Button>
          <Button onClick={handleVerifyOtp} className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-700" disabled={!isOtpSent}>
            Verify OTP
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OtpVerification;
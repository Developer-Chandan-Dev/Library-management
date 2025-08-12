import React from 'react';
import RegistrationForm from '@/components/user/RegistrationForm';
import { BackgroundBeamsWithCollision } from '@/components/ui/background-beams-with-collision';

const RegistrationPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <BackgroundBeamsWithCollision>
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <div className="bg-card text-card-foreground rounded-lg shadow-lg p-6 md:p-8">
              <h1 className="text-3xl font-bold text-center mb-2">Student Registration</h1>
              <p className="text-muted-foreground text-center mb-8">
                Register for library services
              </p>
              <RegistrationForm />
            </div>
          </div>
        </div>
      </BackgroundBeamsWithCollision>
    </div>
  );
};

export default RegistrationPage;

import React from 'react';
import RegistrationForm from '@/components/user/RegistrationForm';
import { BackgroundBeamsWithCollision } from '@/components/ui/background-beams-with-collision';

const RegistrationPage = () => {
  return (
    <div className="h-screen bg-background">
      <BackgroundBeamsWithCollision className='h-[100vh]'>
        <div className="container mx-auto px-4 py-8 h-full">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-full overflow-y-auto">
            <div className="bg-card text-card-foreground rounded-lg shadow-lg p-4 md:p-6 lg:p-8 md:col-span-2">
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


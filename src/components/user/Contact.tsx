'use client';
import { motion } from 'framer-motion';
import {
  IconBrandGmail,
  IconBrandWhatsapp,
  IconLocation,
} from '@tabler/icons-react';
import ContactForm from './ContactForm';
import { PhoneIcon, TimerIcon } from 'lucide-react';

const Contact = () => {
  return (
    <motion.section
      initial={{
        opacity: 0,
        y: 10,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.3,
        delay: 1.2,
      }}
      id="contact"
      className="text-gray-600 body-font overflow-hidden relative z-10 mt-20 rounded-3xl border border-neutral-200 bg-neutral-100 p-4 shadow-md dark:border-neutral-800 dark:bg-neutral-900 mb-20"
    >
      <div className="container px-5 pb-10 pt-20 mx-auto">
        <div className="lg:w-4/5 mx-auto flex flex-wrap">
          <ContactForm />
          <div className="lg:w-1/2 w-full lg:pl-10 lg:py-6 mt-6 lg:mt-0">
            <h2 className="text-sm title-font text-gray-500 tracking-widest">
              Digital Library
            </h2>
            <h2 className="text-neutral-900 font-bold text-3xl title-font mb-1">
              Contact Us
            </h2>

            <div className="md:pr-10 md:py-3">
              <div className="flex relative pb-3">
                <div className="h-full w-10 absolute inset-0 flex items-center justify-center">
                  <div className="h-full w-1 bg-gray-200 pointer-events-none"></div>
                </div>
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-indigo-500 inline-flex items-center justify-center text-white relative z-10">
                  <IconLocation className="w-5 h-5" />
                </div>
                <div className="flex-grow pl-4">
                  <h2 className="font-medium title-font text-sm text-gray-900 mb-1 tracking-wider">
                    Address
                  </h2>
                  <p className="leading-relaxed text-neutral-600">
                    G. B. Coaching, 17/65, Near Central Park, Swaroop Nagar,
                    Kanpur - 208002, India
                  </p>
                </div>
              </div>
              <div className="flex relative pb-5">
                <div className="h-full w-10 absolute inset-0 flex items-center justify-center">
                  <div className="h-full w-1 bg-gray-200 pointer-events-none"></div>
                </div>
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-indigo-500 inline-flex items-center justify-center text-white relative z-10">
                  <PhoneIcon className="w-5 h-5" />
                </div>
                <div className="flex-grow pl-4">
                  <h2 className="font-medium title-font text-sm text-gray-900 mb-1 tracking-wider">
                    Phone
                  </h2>
                  <p className="leading-relaxed">+91 - 9876543210</p>
                </div>
              </div>
              <div className="flex relative pb-5">
                <div className="h-full w-10 absolute inset-0 flex items-center justify-center">
                  <div className="h-full w-1 bg-gray-200 pointer-events-none"></div>
                </div>
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-indigo-500 inline-flex items-center justify-center text-white relative z-10">
                  <IconBrandWhatsapp />
                </div>
                <div className="flex-grow pl-4">
                  <h2 className="font-medium title-font text-sm text-gray-900 mb-1 tracking-wider">
                    WhatsApp
                  </h2>
                  <p className="leading-relaxed">+91 - 9876543210</p>
                </div>
              </div>
              <div className="flex relative pb-5">
                <div className="h-full w-10 absolute inset-0 flex items-center justify-center">
                  <div className="h-full w-1 bg-gray-200 pointer-events-none"></div>
                </div>
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-indigo-500 inline-flex items-center justify-center text-white relative z-10">
                  <IconBrandGmail />
                </div>
                <div className="flex-grow pl-4">
                  <h2 className="font-medium title-font text-sm text-gray-900 mb-1 tracking-wider">
                    Email
                  </h2>
                  <p className="leading-relaxed">gbtech@tech.com</p>
                </div>
              </div>
              <div className="flex relative">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-indigo-500 inline-flex items-center justify-center text-white relative z-10">
                  <TimerIcon className="w-5 h-5" />
                </div>
                <div className="flex-grow pl-4">
                  <h2 className="font-medium title-font text-sm text-gray-900 mb-1 tracking-wider">
                    Timing
                  </h2>
                  <p className="leading-relaxed">Mon - Sun 7:00 AM - 7:00 PM</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default Contact;

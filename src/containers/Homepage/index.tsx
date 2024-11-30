import React, { useState, useMemo, lazy, Suspense } from "react";
import { motion } from "framer-motion";

// Lazy load components for better performance
const SignUpForm = lazy(() => import("../../components/Signup"));
const Login = lazy(() => import("../../components/Login"));
const ForgotPassword = lazy(() => import("../../components/Forgot"));

// Define form types
const FORM_TYPES = {
  SIGNUP: "signup",
  LOGIN: "login",
  FORGOT: "forgot",
};

const Homepage = ({ setUser }) => {
  const [currentForm, setCurrentForm] = useState(FORM_TYPES.LOGIN);

  // Memoize the form rendering function
  const renderForm = useMemo(() => {
    const forms = {
      [FORM_TYPES.SIGNUP]: <SignUpForm onChangeForm={setCurrentForm} />,
      [FORM_TYPES.LOGIN]: <Login onChangeForm={setCurrentForm} setUser={setUser} />,
      [FORM_TYPES.FORGOT]: <ForgotPassword onChangeForm={setCurrentForm} />,
    };

    return forms[currentForm] || forms[FORM_TYPES.LOGIN];
  }, [currentForm, setUser]);

  const features = [
    "Targeted campaigns to deliver personalized offers",
    "Pre-built templates to send updates & reminders",
    "24x7 instant engagement with no-code chatbots",
    "Powerful automations to resolve issues faster",
    "Integrations to bring in context from Zoho, Shopify etc.",
  ];

  const trustedCompanies = [
    { name: "Google", logo: "/assets/images/svg/google.svg", width: 80, height: 80 },
    { name: "Netflix", logo: "/assets/images/svg/netflix.svg", width: 80, height: 80 },
    { name: "Apple", logo: "/assets/images/svg/apple-logo.svg", width: 20, height: 80 },
    { name: "Garmin", logo: "/assets/images/svg/garmin_logo.svg", width: 80, height: 80 },
    { name: "OpenAI", logo: "/assets/images/svg/openai-logo.svg", width: 80, height: 80, className: "mt-[-24px]" },
  ];

  return (
    <div className="min-h-screen login bg-gradient-to-r from-[#ab1ab3d0] from-10% via-[#b764b0] via-30% to-[#9849cabc] to-90%">
      <motion.h2 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-5xl text-center lg:text-left font-semibold text-white p-4"
      >
        PuRat
      </motion.h2>
      <div className="flex flex-col lg:flex-row gap-12 items-center justify-center min-h-[calc(100vh-80px)]">
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="hidden basis-[44%] text-white lg:block"
        >
          <h3 className="text-2xl xl:text-3xl font-serif mb-8">
            All the essential elements for expanding your business on WhatsApp
          </h3>
          <ul className="flex list-disc flex-col gap-3 font pl-6 mb-4 text-lg xl:text-xl">
            {features.map((feature, index) => (
              <motion.li 
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
              >
                {feature}
              </motion.li>
            ))}
          </ul>
          <h3 className="text-xl xl:text-2xl font-semibold mb-3">
            Trusted by 6000+ users across 52 countries
          </h3>
          <ul className="flex gap-5 font-medium xl:text-xl">
            {trustedCompanies.map((company, index) => (
              <motion.li 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                className={company.className}
              >
                <img
                  src={company.logo}
                  alt={`${company.name} logo`}
                  width={company.width}
                  height={company.height}
                  loading="lazy"
                />
              </motion.li>
            ))}
          </ul>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="m-[4%] xl:m-0 xl:basis-1/3 xl:max-w-[465px]"
        >
          <Suspense fallback={<div>Loading...</div>}>
            {renderForm}
          </Suspense>
        </motion.div>
      </div>
    </div>
  );
};

export default React.memo(Homepage);

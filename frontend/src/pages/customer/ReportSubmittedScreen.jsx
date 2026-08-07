import React from 'react';
import { useNavigate } from 'react-router-dom';
import { RESTAURANT_INFO } from '../../utils/mockData';
import Icon from '../../components/common/Icon';
import TopAppBar from '../../components/layout/TopAppBar';

const ReportSubmittedScreen = () => {
  const navigate = useNavigate();

  return (
    <>
      <TopAppBar variant="brand" />

      <main className="flex-1 flex flex-col items-center justify-center px-4 w-full max-w-md mx-auto text-center pt-20 pb-16">
        {/* Animated Success Illustration */}
        <div className="relative w-32 h-32 mb-8">
          <div className="absolute inset-0 bg-success/10 rounded-full scale-125 animate-pulse" />
          <div className="relative flex items-center justify-center w-full h-full bg-success rounded-full shadow-lg">
            <svg className="w-16 h-16 text-white stroke-current fill-none" strokeWidth="4" viewBox="0 0 52 52">
              <path
                d="M14.1 27.2l7.1 7.2 16.7-16.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>

        {/* Success Copy */}
        <h2 className="text-2xl font-bold text-on-surface mb-3">Report Submitted</h2>
        <p className="text-base text-on-surface-variant max-w-[280px] mb-12">
          Our staff has been notified and will assist you shortly.
        </p>

        {/* Atmosphere Image */}
        <div className="w-full aspect-video rounded-xl overflow-hidden mb-12 shadow-sm border border-outline-variant/30">
          <div
            className="bg-cover bg-center w-full h-full"
            style={{ backgroundImage: `url('${RESTAURANT_INFO.heroImage}')` }}
          />
        </div>

        {/* Primary Action */}
        <button
          onClick={() => navigate('/order-tracking')}
          className="w-full h-14 bg-primary text-on-primary rounded-xl text-lg font-semibold shadow-sm hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-2"
        >
          <span>Back to Order Tracking</span>
          <Icon name="receipt_long" />
        </button>
      </main>
    </>
  );
};

export default ReportSubmittedScreen;

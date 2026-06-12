import React from 'react';
import { FeatureCard } from '../components/FeatureCard';
import { TipStep } from '../components/TipStep';

// SVG Icon Components
const UsersIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
    <circle cx="9" cy="7" r="4"></circle>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
  </svg>
);

const ChartIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <line x1="18" y1="20" x2="18" y2="10"></line>
    <line x1="12" y1="20" x2="12" y2="4"></line>
    <line x1="6" y1="20" x2="6" y2="14"></line>
  </svg>
);

const ShieldIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
  </svg>
);

const SupportIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M3 18v-6a9 9 0 0 1 18 0v6"></path>
    <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"></path>
  </svg>
);

const StoreIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
    <polyline points="9 22 9 12 15 12 15 22"></polyline>
  </svg>
);

const ClockIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <circle cx="12" cy="12" r="10"></circle>
    <polyline points="12 6 12 12 16 14"></polyline>
  </svg>
);

const BagIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
    <line x1="3" y1="6" x2="21" y2="6"></line>
    <path d="M16 10a4 4 0 0 1-8 0"></path>
  </svg>
);

const BulbIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M9 18h6"></path>
    <path d="M10 22h4"></path>
    <path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14"></path>
  </svg>
);

const ChecklistIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <line x1="8" y1="6" x2="21" y2="6"></line>
    <line x1="8" y1="12" x2="21" y2="12"></line>
    <line x1="8" y1="18" x2="21" y2="18"></line>
    <polyline points="3 6 4 7 6 5"></polyline>
    <polyline points="3 12 4 13 6 11"></polyline>
    <polyline points="3 18 4 19 6 17"></polyline>
  </svg>
);

const CameraIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
    <circle cx="12" cy="13" r="4"></circle>
  </svg>
);

const TagIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
    <line x1="7" y1="7" x2="7.01" y2="7"></line>
  </svg>
);

const ZapIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
  </svg>
);

const ArrowRightIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <line x1="5" y1="12" x2="19" y2="12"></line>
    <polyline points="12 5 19 12 12 19"></polyline>
  </svg>
);

export const SellerLandingPage = ({ onCreateShopTrigger }) => {
  
  const handleCreateShop = () => {
    // Check if Telegram WebApp API is available
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.HapticFeedback.impactOccurred('medium');
    }
    if (onCreateShopTrigger) {
      onCreateShopTrigger();
    }
  };

  return (
    <div style={styles.container}>
      {/* HEADER NAVIGATION */}
      <header style={styles.header}>
        <div style={styles.logoContainer}>
          <BagIcon style={styles.logoIconSvg} />
          <span style={styles.logoText}>EthioShopify</span>
        </div>
        <div style={styles.userMenu}>
          <div style={styles.avatar}>S</div>
          <span style={styles.roleText}>Seller</span>
          <span style={styles.dropdownArrow}>▾</span>
        </div>
      </header>

      {/* HERO SECTION */}
      <section style={styles.heroSection}>
        <div style={styles.heroLeft}>
          <h1 style={styles.heroTitle}>
            Start selling by <br />
            <span style={styles.heroTitleGreen}>creating your shop</span>
          </h1>
          <p style={styles.heroSubtitle}>
            Create your shop to add products, manage orders, and grow your business all in one place.
          </p>
          
          <button onClick={handleCreateShop} style={styles.ctaButton}>
            <StoreIcon style={styles.buttonIcon} />
            Create Shop
          </button>
          
          <div style={styles.infoBanner}>
            <ClockIcon style={styles.clockIconSvg} />
            <p style={styles.infoText}>
              It only takes a few minutes to set up your shop and start selling!
            </p>
          </div>
        </div>
      </section>

      {/* WHY SELL SECTION */}
      <section style={styles.featuresSection}>
        <h3 style={styles.sectionTitle}>Why sell on EthioShopify?</h3>
        <div style={styles.grid}>
          <FeatureCard 
            icon={UsersIcon} 
            title="Reach Thousands of Customers" 
            description="Get your products in front of thousands of buyers across Ethiopia looking for quality products like yours." 
          />
          <FeatureCard 
            icon={ChartIcon} 
            title="Grow Your Business" 
            description="Powerful tools and insights to help you increase sales and grow your business faster." 
          />
          <FeatureCard 
            icon={ShieldIcon} 
            title="Secure & Reliable" 
            description="Your data and transactions are protected with top-level security you can trust." 
          />
          <FeatureCard 
            icon={SupportIcon} 
            title="24/7 Seller Support" 
            description="Our support team is always ready to help you anytime you need assistance." 
          />
        </div>
      </section>

      {/* SUCCESS BANNER */}
      <section style={styles.successBanner}>
        <div style={styles.shopIconContainer}>
          <StoreIcon style={styles.shopIconSvg} />
        </div>
        <div style={styles.successContent}>
          <h4 style={styles.successTitle}>Everything you need to succeed</h4>
          <p style={styles.successText}>
            From adding products to managing orders and getting paid — EthioShopify has all the tools you need in one simple platform.
          </p>
        </div>
        <button style={styles.learnMoreBtn}>
          Learn More
          <ArrowRightIcon style={styles.smallIcon} />
        </button>
      </section>

      {/* SELLER TIPS SECTION */}
      <section style={styles.tipsSection}>
        <div style={styles.tipsHeaderContainer}>
          <div style={styles.tipsHeaderLeft}>
            <div style={styles.bulbIconContainer}>
              <BulbIcon style={styles.bulbIconSvg} />
            </div>
            <div>
              <h4 style={styles.tipsSectionTitle}>Seller Tips</h4>
              <p style={styles.tipsSectionSubtitle}>Follow these tips to set up your shop for success and start getting your first sales.</p>
            </div>
          </div>
          
          <div style={styles.checklistPlaceholder}>
            <ChecklistIcon style={styles.checklistIconSvg} />
          </div>
        </div>

        <hr style={styles.divider} />

        <div style={styles.stepsRow}>
          <TipStep icon={StoreIcon} text="Complete your shop profile for trust" />
          <TipStep icon={CameraIcon} text="Add clear product images & details" />
          <TipStep icon={TagIcon} text="Set competitive prices" />
          <TipStep icon={ZapIcon} text="Respond to customers quickly" />
        </div>
      </section>
    </div>
  );
};

// CSS-in-JS object optimized for Telegram viewport scrolling profiles
const styles = {
  container: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    backgroundColor: '#f8fafc',
    minHeight: '100vh',
    padding: '16px',
    boxSizing: 'border-box',
    maxWidth: '480px', // Restricts layout stretch on desktop Telegram client
    margin: '0 auto',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
  },
  logoContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  logoIconSvg: {
    width: '22px',
    height: '22px',
    color: '#00a84e',
  },
  logoText: {
    fontWeight: '700',
    fontSize: '18px',
    color: '#0e1e25',
  },
  userMenu: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    backgroundColor: '#ffffff',
    padding: '4px 10px 4px 4px',
    borderRadius: '20px',
    border: '1px solid #eaeaea',
  },
  avatar: {
    width: '24px',
    height: '24px',
    backgroundColor: '#e2f7ec',
    color: '#00a84e',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '12px',
    fontWeight: 'bold',
  },
  roleText: {
    fontSize: '13px',
    fontWeight: '500',
    color: '#4a555a',
  },
  dropdownArrow: {
    fontSize: '10px',
    color: '#888',
  },
  heroSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    marginBottom: '28px',
  },
  heroTitle: {
    fontSize: '28px',
    fontWeight: '800',
    color: '#0e1e25',
    margin: '0 0 12px 0',
    lineHeight: '1.2',
  },
  heroTitleGreen: {
    color: '#00a84e',
  },
  heroSubtitle: {
    fontSize: '14px',
    color: '#55656e',
    lineHeight: '1.5',
    margin: '0 0 20px 0',
  },
  ctaButton: {
    width: '100%',
    backgroundColor: '#00a84e',
    color: '#ffffff',
    border: 'none',
    padding: '14px 0',
    borderRadius: '10px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(0, 168, 78, 0.2)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
  },
  buttonIcon: {
    width: '20px',
    height: '20px',
  },
  infoBanner: {
    display: 'flex',
    gap: '10px',
    backgroundColor: '#edf9f2',
    padding: '12px',
    borderRadius: '8px',
    marginTop: '14px',
    alignItems: 'center',
  },
  clockIconSvg: {
    width: '18px',
    height: '18px',
    color: '#00a84e',
    flexShrink: 0,
  },
  infoText: {
    margin: 0,
    fontSize: '12px',
    color: '#00a84e',
    fontWeight: '500',
    lineHeight: '1.4',
  },

  featuresSection: {
    marginBottom: '28px',
  },
  sectionTitle: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#0e1e25',
    margin: '0 0 16px 0',
  },
  grid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  successBanner: {
    backgroundColor: '#f4fbf7',
    border: '1px solid #e1f5eb',
    borderRadius: '14px',
    padding: '16px',
    display: 'flex',
    gap: '12px',
    alignItems: 'center',
    position: 'relative',
    marginBottom: '28px',
  },
  shopIconContainer: {
    width: '54px',
    height: '54px',
    backgroundColor: '#ffffff',
    border: '1px dashed #a3e2c0',
    borderRadius: '10px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  shopIconSvg: {
    width: '24px',
    height: '24px',
    color: '#00a84e',
  },
  successContent: {
    flex: 1,
    paddingRight: '60px', // space out layout so button doesn't clip text
  },
  successTitle: {
    margin: '0 0 4px 0',
    fontSize: '13px',
    fontWeight: '700',
    color: '#0e1e25',
  },
  successText: {
    margin: 0,
    fontSize: '11px',
    color: '#55656e',
    lineHeight: '1.4',
  },
  learnMoreBtn: {
    position: 'absolute',
    right: '16px',
    backgroundColor: '#ffffff',
    border: '1px solid #eaeaea',
    padding: '6px 10px',
    borderRadius: '6px',
    fontSize: '11px',
    fontWeight: '600',
    color: '#00a84e',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
  smallIcon: {
    width: '12px',
    height: '12px',
  },
  tipsSection: {
    backgroundColor: '#ffffff',
    borderRadius: '14px',
    border: '1px solid #f0f0f0',
    padding: '16px',
  },
  tipsHeaderContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tipsHeaderLeft: {
    display: 'flex',
    gap: '12px',
    alignItems: 'flex-start',
    maxWidth: '75%',
  },
  bulbIconContainer: {
    backgroundColor: '#fffde6',
    padding: '6px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bulbIconSvg: {
    width: '18px',
    height: '18px',
    color: '#f5a623',
  },
  tipsSectionTitle: {
    margin: '0 0 4px 0',
    fontSize: '15px',
    fontWeight: '700',
    color: '#0e1e25',
  },
  tipsSectionSubtitle: {
    margin: 0,
    fontSize: '12px',
    color: '#66767e',
    lineHeight: '1.4',
  },
  checklistPlaceholder: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    border: '1px dashed #ccd4d8',
    padding: '6px',
    borderRadius: '8px',
    backgroundColor: '#f8fafc',
  },
  checklistIconSvg: {
    width: '20px',
    height: '20px',
    color: '#66767e',
  },
  divider: {
    border: 'none',
    borderTop: '1px solid #f0f0f0',
    margin: '16px 0',
  },
  stepsRow: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '8px',
  },
};

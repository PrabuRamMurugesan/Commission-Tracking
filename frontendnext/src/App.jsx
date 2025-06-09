import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import AdminDashboard from "./pages/dashboard/AdminDashboard";
import AgentDashboard from "./pages/dashboard/AgentDashboard";
import TerritoryHeadDashboard from "./pages/dashboard/TerritoryHeadDashboard";
import VendorDashboard from "./pages/dashboard/VendorDashboard";
import CustomerVendorDashboard from "./pages/dashboard/CustomerVendorDashboard";
import Dashboard from "./components/Dashboard";
import FranchiseCreatePage from "./components/FranchiseCreatePage";
import Login from "./pages/auth/Login"; // Login page for user authentication
import SignUpForm from "./pages/auth/SignupPage"; // Login page for user authentication
import PrivateRoute from "./components/PrivateRoute"; // Protect sensitive routes
import ReferralDashboard from "./pages/ReferralDashboard";
import AdminOverview from "./pages/dashboard/AdminOverview";
import CommissionCard from "./components/CommissionCard";
import DashboardStats from "./components/DashboardStats";
import CommissionList from "./pages/CommissionList";
import CommissionDetails from "./pages/CommissionDetails";
import AddCommission from "./pages/AddCommission";
import FranchiseList from "./pages/FranchiseList";
import TerritoryHeadList from "./pages/TerritoryHeadList";
import Reports from "./pages/Reports";
import Profile from "./pages/users/UserProfilePage";
import TransactionCard from "./components/TransactionCard";
import FranchiseDashboard from "./pages/dashboard/FranchiseeDashboard"; // Check if this path is correct
import Header from "./components/Header";
import Footer from "./components/Footer";
import AgentMarketplace from "./pages/AgentMarketplace";
import AIInsightsDashboard from "./pages/dashboard/AIInsightsDashboard";
import BonusRewards from "./pages/BonusRewards";
import AIAnomalyDetection from "./pages/AIAnomalyDetection";
import CommissionBreakdownPage from "./pages/CommissionBreakdown";
import CommissionCalculatorPage from "./pages/CommissionCalculator";
import CommissionPayouts from "./pages/CommissionPayouts";
import CommissionSettingsPage from "./pages/CommissionSettings";
import CommissionTrendsPage from "./pages/CommissionTrends";
import CRMUserManagement from "./pages/CRMUserManagement";
import CustomerBecomeAVendorMarketplace from "./pages/CustomerBecomeAVendorMarketplace";
import CustomerBecomeVendorSelfService from "./pages/CustomerBecomeVendorSelfService";
import CustomerList from "./pages/CustomerList";
import AgentList from "./pages/AgentList";
import CustomerLoginForm from "./pages/Customerlogin";
import IncentivePrograms from "./pages/IncentivePrograms";
import CustomerOnlineOrder from "./pages/CustomerOnlineOrder";
import Marketplace from "./pages/Marketplace";
import PayoutManagement from "./pages/PayoutManagement";
import CustomerPurchased from "./pages/CustomerPurchased";
import CustomerTransactions from "./pages/CustomerTransactions";
import DarkModeSettings from "./pages/DarkModeSettings";
import EscrowPayments from "./pages/EscrowPayments";
import MultiCurrencySupportPage from "./pages/MultiCurrencySupport";
import HierarchyPerformance from "./pages/HierarchyPerformance";
import HierarchyManagement from "./pages/HierarchyManagement";
import PerformanceAnalytics from "./pages/PerformanceAnalytics";
import PredictiveMarketing from "./pages/PredictiveMarketing";
import ReferralBonuses from "./pages/ReferralBonuses";
import ReferralMarketplace from "./pages/ReferralMarketplace";
import ReferralSelfService from "./pages/ReferralSelfService";
import RevenueBreakdown from "./pages/RevenueBreakdown";
import RevenueTracking from "./pages/RevenueTracking";
import SalesForecasting from "./pages/SalesForecasting";
import SalesLeaderboard from "./pages/SalesLeaderboard";
import SelfServicePortal from "./pages/SelfServicePortal";
import SupportTickets from "./pages/SupportTickets";
import TerritoryHeadMarketplace from "./pages/TerritoryHeadMarketplace";
import TerritoryHeadSelfService from "./pages/TerritoryHeadSelfService";
import TransactionHistory from "./pages/TransactionHistory";
import UserAnalytics from "./pages/UserAnalytics";
import UserFeedback from "./pages/UserFeedback";
import UserManagement from "./pages/UserManagement";
import UserRolesPermissions from "./pages/UserRolesPermissions";
import VendorMarketplace from "./pages/VendorMarketplace";
import VendorSelfService from "./pages/VendorSelfService";
import AIAuditCompliance from "./pages/AIAuditCompliance";
import AIAutoHealingSystem from "./pages/AIAutoHealingSystem";
import AIAutomatedExpenseTracking from "./pages/AIAutomatedExpenseTracking";
import AIAutomatedProductRecommendations from "./pages/AIAutomatedProductRecommendations";
import AIAutomatedTaxCalculation from "./pages/AIAutomatedTaxCalculation";
import AIAutomationSuite from "./pages/AIAutomationSuite";
import AIAutoReplyChatbot from "./pages/AIAutoReplyChatbot";
import AIAutoResourceAllocation from "./pages/AIAutoResourceAllocation";
import AIAutoScaling from "./pages/AIAutoScaling";
import AIAutoScalingManagement from "./pages/AIAutoScalingManagement";
import AIAutoScalingSecurity from "./pages/AIAutoScalingSecurity";
import AIBehaviorAnalysis from "./pages/AIBehaviorAnalysis";
import AIBugDetection from "./pages/AIBugDetection";
import AICloudCostOptimization from "./pages/AICloudCostOptimization";
import AICRMFinalTesting from "./pages/AICRMFinalTesting";
import AICustomerInsights from "./pages/AICustomerInsights";
import TopPerformanceDashboard from "./pages/reports/TopPerformance";
import Transactions from "./pages/Transactions";
import UserList from "./pages/users/UserList";
import UserProfilePage from "./pages/users/UserProfilePage";
import VendorList from "./pages/VendorList";
import VendorCustomerList from "./pages/VendorCustomerList"
import CbvList from "./pages/CbvList";
import CbvCustomerList from "./pages/CbvCustomerList";
import AgentCustomerList from "./pages/AgentCustomerList";
import FranchiseCustomerList from "./pages/FranchiseCustomerList";
import TerritoryHeadCustomerList from "./pages/TerritoryHeadCustomerList";
import SalesReportPage from "./pages/reports/SalesReportPage";
import CommissionReportPage from "./pages/reports/CommissionReportPage";
import TransactionReportPage from "./components/Reports/TransactionReportPage";
import CustomerReportPage from "./pages/reports/CustomerReportPage";
import VendorReportPage from "./pages/reports/VendorReportPage";
import TerritoryHeadReportPage from "./pages/reports/Territory-HeadReportPage";
import FranchiseReportPage from "./pages/reports/FranchiseeReportPage";
import CustomerBecomeVendorReportPage from "./pages/reports/CustomerBecomeVendorReportPage";
import AgentsReportPage from "./pages/reports/AgentReportPage";
import AdminTaxSettingsPage from "./pages/AdminTaxSettingsPage";
import CBAVGSTPage from "./pages/Tax/CBAVGSTPage";
import TerritoryHeadGSTPage from "./pages/Tax/TerritoryHeadGSTPage";
import FranchiseeGSTPage from "./pages/Tax/FranchiseeGSTPage";
import AgentGSTPage from "./pages/AgentGSTPage";
import VendorGSTPage from "./pages/Tax/VendorGSTPage";
import TaxationSettings from "./pages/Tax/TaxationSettings";
import GSTFilingAssistant from "./pages/Tax/GSTFilingAssistant";
import InvoiceDashboard from "./pages/Invoice/InvoiceDashboard";
import InvoiceCreatePage from "./pages/Invoice/InvoiceCreatePage";
import InvoiceListPage from "./pages/Invoice/InvoiceListPage";
import InvoiceDetailPage from "./pages/Invoice/InvoiceDetailPage";
import InvoiceEditPage from "./pages/Invoice/InvoiceEditPage";
import InvoicePreviewPage from "./pages/Invoice/InvoicePreviewPage";
import InvoiceDownload from "./pages/Invoice/InvoiceDownload";
import InvoiceStatusTracker from "./pages/Invoice/InvoiceStatusTracker";
import InvoiceEscrowInfo from "./pages/Invoice/InvoiceEscrowInfo";
import InvoiceWalletHistory from "./pages/Invoice/InvoiceWalletHistory";
import InvoiceTaxBreakdown from "./pages/Invoice/InvoiceTaxBreakdown";
import InvoiceFilterPanel from "./pages/Invoice/InvoiceFilterPanel";
import InvoiceExportButton from "./pages/Invoice/InvoiceExportButton";
import InvoicePrintPreview from "./pages/Invoice/InvoicePrintPreview";
import InvoiceSummaryBox from "./pages/Invoice/InvoiceSummaryBox";
import InvoicePagination from "./pages/Invoice/InvoicePagination";
import InvoiceCustomerSidePreview from "./pages/Invoice/InvoiceCustomerSidePreview";
import InvoiceDownloadOptions from "./pages/Invoice/InvoiceDownloadOptions";
import InvoiceRecurringSetup from "./pages/Invoice/InvoiceRecurringSetup";
import InvoiceSmartMerge from "./pages/Invoice/InvoiceSmartMerge";
import InvoiceAuditLog from "./pages/Invoice/InvoiceAuditLog";
import InvoiceAdminNote from "./pages/Invoice/InvoiceAdminNote";

function App() {
  return (
    <Router>
      <div className="app">
        <Header />
        <div className="content">
          <Routes>
            {/* Default Dashboard Route */}
            <Route
              path="/Dashboard"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            {/* Login Route (Public) */}
            <Route path="/header" element={<Header />} />
            <Route path="/" element={<Login />} />
            <Route path="/signup" element={<SignUpForm />} />
            <Route path="/usermanagement" element={<UserManagement />} />
            {/* Admin Dashboard */}
            <Route
              path="/AdminDashboard"
              element={
                <PrivateRoute>
                  <AdminDashboard />
                </PrivateRoute>
              }
            />
            {/* Agent Dashboard */}
            <Route path="/dashboard/agent" element={<AgentDashboard />} />
            {/* Franchise Dashboard */}
            <Route
              path="/dashboard/franchise"
              element={<FranchiseDashboard />} //does this need to be a link?
            />
            {/* Territory Head Dashboard */}
            <Route
              path="/dashboard/territory"
              element={<TerritoryHeadDashboard />} //done this
            />
            {/* Customer-Vendor Dashboard */}
            <Route
              path="/dashboard/customer-become-vendor"
              element={<CustomerVendorDashboard />} //done this
            />
            <Route
              path="/dashboard/transactions"
              element={<Transactions />} //done this
            />
            <Route
              path="/transactions"
              element={<Transactions />} //done this
            />
            {/* Admin Overview */}
            <Route
              path="customer-tables-vendor"
              element={<AdminOverview />} // done this
            />
            {/* Commission Routes */}
            <Route
              path="/dashboard/commission-list"
              element={<CommissionList />}
            />
            <Route
              path="/dashboard/commission-details"
              element={<CommissionDetails />}
            />
            <Route
              path="/dashboard/commission-breakdown"
              element={<CommissionBreakdownPage />} //Done this
            />
            <Route
              path="/dashboard/commission-calculator"
              element={<CommissionCalculatorPage />} //Done this
            />
            <Route
              path="/dashboard/commission-payouts"
              element={<CommissionPayouts />} //Done this
            />
            <Route
              path="/commission-settings"
              element={<CommissionSettingsPage />} //Done this
            />
            <Route
              path="/dashboard/commission-trends"
              element={<CommissionTrendsPage />} //Done this
            />
            {/* CRM */}
            <Route
              path="/dashboard/crm-user-management"
              element={<CRMUserManagement />} //Done this
            />
            {/* Customer Options */}
            <Route
              path="/dashboard/customer-become-a-vendor"
              element={<CustomerBecomeAVendorMarketplace />} // also done
            />
            <Route
              path="/dashboard/customer-become-vendor-selfservice"
              element={<CustomerBecomeVendorSelfService />} // PENDING  sidebar (mobile-size)
            />
            <Route
              path="/dashboard/customer-list"
              element={<CustomerList />} //Done this
            />
            <Route
              path="/dashboard/agent-list"
              element={<AgentList />} //Done this
            />
            <Route
              path="/dashboard/agent-customer-list"
              element={<AgentCustomerList />} //Done this
            />
            <Route
              path="/dashboard/vendor-list"
              element={<VendorList />} //Done this
            />
            <Route
              path="/dashboard/vendor-customer-list"
              element={<VendorCustomerList />} //Done this
            />
            <Route
              path="/dashboard/cbv-list"
              element={<CbvList />} //Done this
            />
            <Route
              path="/dashboard/cbv-customer-list"
              element={<CbvCustomerList />} //Done this
            />
            <Route
              path="/dashboard/franchise-list"
              element={<FranchiseList />} //Done this
            />
            <Route
              path="/dashboard/territory-list"
              element={<TerritoryHeadList />} //Done this
            />
            <Route
              path="/dashboard/territory-customer-list"
              element={<TerritoryHeadCustomerList />} //Done this
            />
            <Route
              path="/dashboard/customer-log-in"
              element={<CustomerLoginForm />} //Done this
            />
            <Route
              path="/dashboard/customer-online-order"
              element={<CustomerOnlineOrder />} // Done this
            />
            <Route
              path="/dashboard/customer-purchase"
              element={<CustomerPurchased />} // Done this
            />
            <Route
              path="/dashboard/customer-transaction"
              element={<CustomerTransactions />} // Done this
            />
            <Route
              path="/dashboard/dark-mode"
              element={<DarkModeSettings />} // Done this
            />
            {/* Marketplace */}
            <Route
              path="/dashboard/agent-marketplace"
              element={<AgentMarketplace />} //Done this
            />
            <Route
              path="/dashboard/market-place"
              element={<Marketplace />} //Done this
            />
            {/* AI */}
            <Route
              path="/dashboard/ai-insights"
              element={<AIInsightsDashboard />} //Done this
            />
            <Route
              path="/dashboard/ai-anomaly-detection"
              element={<AIAnomalyDetection />} //Done this
            />
            {/* Others */}
            <Route
              path="/dashboard/bonus-rewards"
              element={<BonusRewards />} // Done this
            />
            <Route path="/dashboard/dark-mode" element={<DarkModeSettings />} />
            <Route
              path="/dashboard/escrow-payments"
              element={<EscrowPayments />} //Done this
            />
            <Route
              path="/dashboard/incentive-programs"
              element={<IncentivePrograms />} //done this
            />
            <Route
              path="/dashboard/payout-management"
              element={<PayoutManagement />} //Done this
            />
            <Route
              path="/dashboard/multi-currency"
              element={<MultiCurrencySupportPage />} //done this
            />
            <Route
              path="/dashboard/hierarchy-performance"
              element={<HierarchyPerformance />} //Done this (but responsive)
            />
            <Route
              path="/dashboard/hierarchy-management"
              element={<HierarchyManagement />} //Done this
            />
            <Route
              path="/dashboard/performance-analytics"
              element={<PerformanceAnalytics />} //done this
            />
            <Route
              path="/dashboard/predictive-marketing"
              element={<PredictiveMarketing />} //Done this
            />
            <Route
              path="/dashboard/referral-bonuses"
              element={<ReferralBonuses />} //done this
            />
            <Route
              path="/dashboard/referral-marketplace"
              element={<ReferralMarketplace />}
            />
            //26.04.25
            <Route
              path="/dashboard/referral-self-service"
              element={<ReferralSelfService />}
            />
            <Route
              path="/dashboard/revenue-breakdown"
              element={<RevenueBreakdown />}
            />
            <Route path="/dashboard/reports" element={<Reports />} />
            <Route
              path="/dashboard/revenue-tracking"
              element={<RevenueTracking />}
            />
            <Route
              path="/dashboard/sales-forecasting"
              element={<SalesForecasting />}
            />
            <Route
              path="/dashboard/sales-leaderboard"
              element={<SalesLeaderboard />}
            />
            <Route
              path="/dashboard/self-service-portal"
              element={<SelfServicePortal />}
            />
            <Route
              path="/dashboard/support-tickets"
              element={<SupportTickets />}
            />
            <Route
              path="/dashboard/territory-head-list"
              element={<TerritoryHeadList />}
            />{" "}
            // unexpected error
            <Route
              path="/dashboard/territory-head-marketplace"
              element={<TerritoryHeadMarketplace />}
            />
            <Route
              path="/dashboard/territory-head-self-service"
              element={<TerritoryHeadSelfService />}
            />
            <Route
              path="/dashboard/transaction-history"
              element={<TransactionHistory />}
            />
            //28.04.25
            <Route
              path="/dashboard/user-analytics"
              element={<UserAnalytics />}
            />
            <Route path="/dashboard/user-feedback" element={<UserFeedback />} />
            <Route
              path="/dashboard/user-management"
              element={<UserManagement />}
            />
            <Route
              path="/dashboard/user-roles-permissions"
              element={<UserRolesPermissions />}
            />
            <Route
              path="/vendor-marketplace-contentmarket-place"
              element={<VendorMarketplace />}
            />
            <Route
              path="/vendor-self-service"
              element={<VendorSelfService />}
            />
            <Route
              path="/dashboard/agent-dashboard"
              element={<AgentDashboard />}
            />
            //29.04.25
            <Route
              path="/dashboard/ai-audit-compliance"
              element={<AIAuditCompliance />}
            />
            <Route
              path="/dashboard/ai-anomaly-detection"
              element={<AIAnomalyDetection />}
            />
            <Route
              path="/dashboard/ai-auto-healing-system"
              element={<AIAutoHealingSystem />}
            />
            <Route
              path="/dashboard/ai-automated-expense-tracking"
              element={<AIAutomatedExpenseTracking />}
            />
            <Route
              path="/dashboard/ai-automated-product-recommendations"
              element={<AIAutomatedProductRecommendations />}
            />
            <Route
              path="/dashboard/ai-automated-tax-calculation"
              element={<AIAutomatedTaxCalculation />}
            />
            //30.04.25
            <Route
              path="/dashboard/ai-automation-suite"
              element={<AIAutomationSuite />}
            />
            <Route
              path="/dashboard/ai-auto-reply-chatbot"
              element={<AIAutoReplyChatbot />}
            />
            <Route
              path="/dashboard/ai-auto-resource-allocation"
              element={<AIAutoResourceAllocation />}
            />
            <Route
              path="/dashboard/ai-auto-scaling"
              element={<AIAutoScaling />}
            />
            <Route
              path="/dashboard/ai-auto-scaling-management"
              element={<AIAutoScalingManagement />}
            />
            <Route
              path="/dashboard/ai-auto-scaling-security"
              element={<AIAutoScalingSecurity />}
            />
            <Route
              path="/dashboard/ai-behavior-analysis"
              element={<AIBehaviorAnalysis />}
            />
            <Route
              path="/dashboard/ai-bug-detection"
              element={<AIBugDetection />}
            />
            <Route
              path="/dashboard/ai-cloud-cost-optimization"
              element={<AICloudCostOptimization />}
            />
            <Route
              path="/dashboard/ai-crm-final-testing"
              element={<AICRMFinalTesting />}
            />
            //02.05.25
            <Route
              path="/dashboard/ai-customer-insights"
              element={<AICustomerInsights />}
            />
            <Route
              path="/dashboard/vendor-dashboard/:id"
              element={<VendorDashboard />}
            />
            <Route
              path="/dashboard/top-performance"
              element={<TopPerformanceDashboard />}
            />
            {/* Dynamic Routes */}
            <Route
              path="/dashboard/territory"
              element={
                <PrivateRoute>
                  <TerritoryHeadDashboard />
                </PrivateRoute>
              } //Done this
            />
            <Route
              path="/dashboard/vendor/:vendorId"
              element={
                <PrivateRoute>
                  <VendorDashboard />
                </PrivateRoute>
              } //Done this
            />
            <Route
              path="/dashboard/customer-vendor/:customerId"
              element={
                <PrivateRoute>
                  <CustomerVendorDashboard />
                </PrivateRoute>
              }
            />
            {/* Other Components */}
            <Route
              path="/FranchiseCreatePage"
              element={
                <PrivateRoute>
                  <FranchiseCreatePage />
                </PrivateRoute>
              } //Done this
            />
            <Route
              path="/ReferralDashboard"
              element={
                <PrivateRoute>
                  <ReferralDashboard />
                </PrivateRoute>
              } //done this
            />
            <Route
              path="/AdminOverview"
              element={
                <PrivateRoute>
                  <AdminOverview />
                </PrivateRoute>
              }
            />
            <Route
              path="/CommissionCard"
              element={
                <PrivateRoute>
                  <CommissionCard />
                </PrivateRoute>
              }
            />
            <Route
              path="/DashboardStats"
              element={
                <PrivateRoute>
                  <DashboardStats />
                </PrivateRoute>
              }
            />
            <Route
              path="/TransactionCard"
              element={
                <PrivateRoute>
                  <TransactionCard />
                </PrivateRoute>
              }
            />
            <Route
              path="/CommissionList"
              element={
                <PrivateRoute>
                  <CommissionList />
                </PrivateRoute>
              }
            />
            <Route
              path="/CommissionDetails"
              element={
                <PrivateRoute>
                  <CommissionDetails />
                </PrivateRoute>
              }
            />
            <Route
              path="/AddCommission"
              element={
                <PrivateRoute>
                  <AddCommission />
                </PrivateRoute>
              } // pending to responive to (mobile-size)
            />
            <Route
              path="/FranchiseList"
              element={
                <PrivateRoute>
                  <FranchiseList />
                </PrivateRoute>
              }
            />
            <Route
              path="/dashboard/franchise-customer-list"
              element={
                <PrivateRoute>
                  <FranchiseCustomerList />
                </PrivateRoute>
              }
            />
            <Route
              path="/TerritoryHeadList"
              element={
                <PrivateRoute>
                  <TerritoryHeadList />
                </PrivateRoute>
              }
            />
            <Route
              path="/Reports"
              element={
                <PrivateRoute>
                  <Reports />
                </PrivateRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <PrivateRoute>
                  <UserProfilePage />
                </PrivateRoute>
              }
            />
            <Route
              path="/sales"
              element={
                <PrivateRoute>
                  <SalesReportPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/transactions-report"
              element={
                <PrivateRoute>
                  <TransactionReportPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/franchise-report"
              element={
                <PrivateRoute>
                  <FranchiseReportPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/customers-report"
              element={
                <PrivateRoute>
                  <CustomerReportPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/vendor-report"
              element={
                <PrivateRoute>
                  <VendorReportPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/agents-report"
              element={
                <PrivateRoute>
                  <AgentsReportPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/customer-become-vendor-report"
              element={
                <PrivateRoute>
                  <CustomerBecomeVendorReportPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/territory-head-report"
              element={
                <PrivateRoute>
                  <TerritoryHeadReportPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/commissions"
              element={
                <PrivateRoute>
                  <CommissionReportPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/admin-tax-setting"
              element={
                <PrivateRoute>
                  <AdminTaxSettingsPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/cbav-tax"
              element={
                <PrivateRoute>
                  <CBAVGSTPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/territory-tax"
              element={
                <PrivateRoute>
                  <TerritoryHeadGSTPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/franchisee-tax"
              element={
                <PrivateRoute>
                  <FranchiseeGSTPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/agent-tax"
              element={
                <PrivateRoute>
                  <AgentGSTPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/vendor-tax"
              element={
                <PrivateRoute>
                  <VendorGSTPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/territory-tax"
              element={
                <PrivateRoute>
                  <TerritoryHeadGSTPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/Taxation-settings"
              element={
                <PrivateRoute>
                  <TaxationSettings />
                </PrivateRoute>
              }
            />
            <Route
              path="/gst-fillingAssitant"
              element={
                <PrivateRoute>
                  <GSTFilingAssistant />
                </PrivateRoute>
              }
            />
            {/*<--------Invoice Pages------>*/}
            <Route
              path="/invoice-Dashboard"
              element={
                <PrivateRoute>
                  <InvoiceDashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/create-invoice"
              element={
                <PrivateRoute>
                  <InvoiceCreatePage />
                </PrivateRoute>
              }
            />
            <Route
              path="/invoice-list"
              element={
                <PrivateRoute>
                  <InvoiceListPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/invoice-details"
              element={
                <PrivateRoute>
                  <InvoiceDetailPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/invoice-edit"
              element={
                <PrivateRoute>
                  <InvoiceEditPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/invoice-preview"
              element={
                <PrivateRoute>
                  <InvoicePreviewPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/invoice-download"
              element={
                <PrivateRoute>
                  <InvoiceDownload />
                </PrivateRoute>
              }
            />
            <Route
              path="/invoice-statusTracker"
              element={
                <PrivateRoute>
                  <InvoiceStatusTracker />
                </PrivateRoute>
              }
            />
            <Route
              path="/invoice-escrowInfo"
              element={
                <PrivateRoute>
                  <InvoiceEscrowInfo />
                </PrivateRoute>
              }
            />
            <Route
              path="/invoice-walletHistory"
              element={
                <PrivateRoute>
                  <InvoiceWalletHistory />
                </PrivateRoute>
              }
            />
            <Route
              path="/invoice-taxBreakdown"
              element={
                <PrivateRoute>
                  <InvoiceTaxBreakdown />
                </PrivateRoute>
              }
            />
            <Route
              path="/invoice-filterpanel"
              element={
                <PrivateRoute>
                  <InvoiceFilterPanel />
                </PrivateRoute>
              }
            />
            <Route
              path="/invoice-exportButton"
              element={
                <PrivateRoute>
                  <InvoiceExportButton />
                </PrivateRoute>
              }
            />
            <Route
              path="/invoice-printPreview"
              element={
                <PrivateRoute>
                  <InvoicePrintPreview />
                </PrivateRoute>
              }
            />
            <Route
              path="/invoice-summaryBox"
              element={
                <PrivateRoute>
                  <InvoiceSummaryBox />
                </PrivateRoute>
              }
            />
            <Route
              path="/invoice-pagination"
              element={
                <PrivateRoute>
                  <InvoicePagination />
                </PrivateRoute>
              }
            />
            <Route
              path="/invoice-customerSidePreview"
              element={
                <PrivateRoute>
                  <InvoiceCustomerSidePreview />
                </PrivateRoute>
              }
            />
            <Route
              path="/invoice-downloadOptions"
              element={
                <PrivateRoute>
                  <InvoiceDownloadOptions />
                </PrivateRoute>
              }
            />
            <Route
              path="/invoice-recurringSetup"
              element={
                <PrivateRoute>
                  <InvoiceRecurringSetup />
                </PrivateRoute>
              }
            />
            <Route
              path="/invoice-smartMerge"
              element={
                <PrivateRoute>
                  <InvoiceSmartMerge />
                </PrivateRoute>
              }
            />
            <Route
              path="/InvoiceAuditLog"
              element={
                <PrivateRoute>
                  <InvoiceAuditLog />
                </PrivateRoute>
              }
            />
            <Route
              path="/InvoiceAuditLog"
              element={
                <PrivateRoute>
                  <InvoiceAuditLog />
                </PrivateRoute>
              }
            />
            <Route
              path="/InvoiceAdminNote"
              element={
                <PrivateRoute>
                  <InvoiceAdminNote />
                </PrivateRoute>
              }
            />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;

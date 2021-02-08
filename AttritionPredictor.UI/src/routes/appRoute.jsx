// @material-ui/icons
import Segment from "@material-ui/icons/Dashboard";
import Dashboard from "@material-ui/icons/Home";
import Sentiment from "@material-ui/icons/GraphicEq";
import Assessment from "@material-ui/icons/Assessment";
import SettingsInputComponent from "@material-ui/icons/SettingsInputComponent";
// components/views
import DashboardPage from "views/components/Dashboard/Dashboard.jsx";
import SentimentAnalysis from "views/components/SentimentAnalysis/SentimentAnalysis.jsx";
import Segments from "views/components/Segments/Segments.jsx";
import MoraleCheckSurvey from "views/components/Survey/MoraleCheckSurvey.jsx";
import RealtimePrediction from "views/components/RealtimePrediction/RealtimePrediction.jsx";

const appRoutes = [
  {
    path: "/dashboard",
    sidebarName: "Dashboard",
    navbarName: "Organization Attrition/Morale Check Analysis",
    icon: Dashboard,
    component: DashboardPage
  },
  {
    path: "/accountDashboard",
    sidebarName: "Account Attrition",
    navbarName: "Account Attrition Analysis",
    icon: Segment,
    component: Segments
  },
  {
    path: "/prediction",
    sidebarName: "Realtime Attrition",
    navbarName: "Real Time Attrition Prediction",
    icon: SettingsInputComponent,
    component: RealtimePrediction
  },
  {
    path: "/morale",
    sidebarName: "Morale Check",
    navbarName: "Morale Check Analysis",
    icon: Sentiment,
    component: SentimentAnalysis
  },
  {
    path: "/survey",
    sidebarName: "Morale Check Survey",
    navbarName: "Morale Check Survey",
    icon: Assessment,
    component: MoraleCheckSurvey
  },
  { redirect: true, path: "/", to: "/dashboard", navbarName: "Redirect" }
];

export default appRoutes;

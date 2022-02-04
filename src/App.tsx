import React, { FC, useEffect } from "react";
import "./App.css";

import config from "./config.json";
import Amplify, { Auth } from "aws-amplify";
import { SignUpParams } from "@aws-amplify/auth";
import * as Sentry from "@sentry/react";
import { BrowserTracing } from "@sentry/tracing";
import ReactGA from "react-ga";
import { App as SendBirdApp } from "sendbird-uikit";
import "sendbird-uikit/dist/index.css";
import { useLocation } from "react-router-dom";
const { naver } = window as any;

Amplify.configure(config.amplify);
Sentry.init({
  dsn: config.sentry.dsn,
  integrations: [new BrowserTracing()],
  tracesSampleRate: 1.0,
});
ReactGA.initialize(config.googleAnalytics);

const NaverLoginButton: FC = () => {
  const initializeNaverLogin = () => {
    const naverLogin = new naver.LoginWithNaverId({
      clientId: config.naver.clientId,
      callbackUrl: window.location.origin,
      isPopup: true,
      loginButton: { color: "green", type: 3, height: "47" },
    });
    naverLogin.init();
  };

  useEffect(() => {
    initializeNaverLogin();
  }, []);

  return <div id="naverIdLogin" />;
};

function App() {
  const location = useLocation();
  const getNaverToken = (): string | null => {
    if (!location.hash || !location.hash.includes("#access_token="))
      return null;
    const token = location.hash.split("=")[1].split("&")[0];
    return token;
  };
  useEffect(() => {
    const accessToken = getNaverToken();
    if (!accessToken) return;
    window.history.replaceState(null, "", window.location.origin);
    console.log(`naver access token: ${accessToken}`);
  }, [location]);
  useEffect(() => {
    // MODULE INSTALLATION+INTEGRATION TESTS
    const testModules = async () => {
      try {
        const randomString = Math.random().toString().replace(".", "zzXX");
        const username = `test-user-${randomString}@thepapap.com`;
        const password = `${randomString}!`;
        const signupParams: SignUpParams = { username, password };
        const { user: cognitoUser } = await Auth.signUp(signupParams);
        console.log("cognitoUser:", cognitoUser);
        const signInRes = await Auth.signIn(username, password);
        console.log("cognito sign in result:", signInRes);
        const authenticatedUser = await Auth.currentAuthenticatedUser();
        console.log("authenticated cognitoUser:", authenticatedUser);

        const sentryResult = Sentry.captureException(
          "Sentry Frontend Error In console"
        );
        console.log("sentryResult:", sentryResult);

        ReactGA.pageview(window.location.pathname + window.location.search);
      } catch (e) {
        console.log("Cognito Error", e);
      }
    };

    testModules();
  }, []);

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
      }}
    >
      <NaverLoginButton />
      <SendBirdApp
        appId={config.sendbird}
        userId="3be17207-f6fa-473d-9fee-443c7bea86d4"
      />
    </div>
  );
}

export default App;

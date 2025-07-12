#!/usr/bin/env node

// Test script to verify Cognito permissions after AWS configuration
import { CognitoIdentityProviderClient, AdminInitiateAuthCommand } from "@aws-sdk/client-cognito-identity-provider";
import crypto from "crypto";

const CLIENT_ID = process.env.VITE_COGNITO_CLIENT_ID || "1d8m1u4lrh78ra0hc3fq3mhbr8";
const CLIENT_SECRET = process.env.VITE_COGNITO_CLIENT_SECRET || "1kv9uirpfepv9on3i6pguikda30gpmqm3pjpfb53vhu9q5vdgj8p";
const USER_POOL_ID = process.env.VITE_COGNITO_USER_POOL_ID || "eu-west-3_9gAerU6W3";
const AWS_REGION = process.env.VITE_AWS_REGION || "eu-west-3";

const client = new CognitoIdentityProviderClient({
  region: AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

function calculateSecretHash(username) {
  const message = username + CLIENT_ID;
  const hash = crypto.createHmac('sha256', CLIENT_SECRET).update(message).digest('base64');
  return hash;
}

async function testCognitoPermissions() {
  console.log("🔍 Testing Cognito permissions...");
  console.log("Client ID:", CLIENT_ID);
  console.log("User Pool ID:", USER_POOL_ID);
  console.log("Region:", AWS_REGION);
  
  try {
    const command = new AdminInitiateAuthCommand({
      UserPoolId: USER_POOL_ID,
      ClientId: CLIENT_ID,
      AuthFlow: "ADMIN_USER_PASSWORD_AUTH",
      AuthParameters: {
        USERNAME: "test@example.com",
        PASSWORD: "Test123!",
        SECRET_HASH: calculateSecretHash("test@example.com"),
      },
    });

    const response = await client.send(command);
    console.log("✅ SUCCESS: Cognito permissions are correctly configured!");
    console.log("Response:", JSON.stringify(response, null, 2));
  } catch (error) {
    if (error.name === 'UserNotFoundException' || error.name === 'NotAuthorizedException') {
      console.log("✅ SUCCESS: Permissions are OK (user doesn't exist or wrong password, but permission works)");
      console.log("Error type:", error.name);
    } else if (error.name === 'AccessDeniedException') {
      console.log("❌ FAILED: Still missing permissions");
      console.log("Error:", error.message);
      console.log("👉 Please check AWS Cognito User Pool settings and enable ALLOW_ADMIN_USER_PASSWORD_AUTH");
    } else {
      console.log("⚠️  UNKNOWN ERROR:", error.name);
      console.log("Message:", error.message);
    }
  }
}

testCognitoPermissions();
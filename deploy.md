# Deployment Guide

To get your Persona-Based AI Chatbot live and accessible via a public URL (required for your assignment), follow these steps:

## 1. Push Code to GitHub
Since the previous push requires your personal credentials, please run these commands in your terminal (inside the `GEN AI` folder):

```bash
# Rename branch to main (if not already)
git branch -m main

# Push to your repository
git push -u origin main
```

## 2. Deploy to Vercel (Recommended)
Vercel is the easiest way to deploy Vite applications.

1.  Go to [Vercel.com](https://vercel.com/) and log in with your GitHub account.
2.  Click **"Add New"** > **"Project"**.
3.  Import your repository: `Pyush269/GEN-AI-ASSIGNMENT`.
4.  **Crucial Step - Environment Variables:**
    - In the "Environment Variables" section, add a new variable:
    - **Key:** `VITE_GEMINI_API_KEY`
    - **Value:** *Your actual Gemini API key*
5.  Click **"Deploy"**.
6.  Once finished, Vercel will provide you with a public URL (e.g., `gen-ai-assignment.vercel.app`).

## 3. Verify the Live App
1.  Open your Vercel URL.
2.  Test the persona switcher.
3.  Ask a question to verify that the API integration is working.

## 4. Final Submission
Update your `README.md` with the live URL and submit your GitHub repository link on the Scaler Google Form.

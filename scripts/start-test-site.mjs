import { spawn } from 'node:child_process';
// A separate local process; never changes the user's real Firebase configuration.
const child = spawn(process.execPath, ['node_modules/vite/bin/vite.js', '--host', '127.0.0.1', '--port', '5188', '--strictPort'], { stdio: 'inherit', env: { ...process.env, VITE_FIREBASE_API_KEY: 'demo-key', VITE_FIREBASE_PROJECT_ID: 'demo-rihla', VITE_FIREBASE_AUTH_DOMAIN: 'demo-rihla.firebaseapp.com', VITE_FIREBASE_APP_ID: 'demo-app', VITE_USE_FIREBASE_EMULATORS: 'true', VITE_RECAPTCHA_ENTERPRISE_SITE_KEY: '' } });
process.on('SIGINT', () => child.kill());
process.on('SIGTERM', () => child.kill());
child.on('exit', code => process.exit(code ?? 0));

let firebaseConfig: Record<string, string>;

switch (import.meta.env.MODE) {
  case 'development': {
    const devEnv = await import('./env.dev');
    firebaseConfig = devEnv.firebaseConfig;
    break;
  }
  case 'production':
  default: {
    const prodEnv = await import('./env.prod');
    firebaseConfig = prodEnv.firebaseConfig;
    break;
  }
}

export default { firebaseConfig };

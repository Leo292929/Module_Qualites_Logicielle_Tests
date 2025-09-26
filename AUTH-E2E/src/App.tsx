import React from 'react';
import { SignupForm } from './SignupForm';

export const App: React.FC = () => {
  return (
    <main style={{maxWidth: 420, margin: '64px auto', fontFamily: 'system-ui, sans-serif'}}>
      <h1 style={{fontSize: 24, marginBottom: 16}}>Créer un compte</h1>
      <p style={{color: '#555', marginBottom: 20}}>
        Renseignez votre nom d’utilisateur, votre e-mail et un mot de passe.
      </p>
      <SignupForm />
    </main>
  );
};

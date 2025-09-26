import React, { useState } from 'react';
import { signup } from './api';

export const SignupForm: React.FC = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus]     = useState<{type:'success'|'error'|'idle'; msg?:string}>({type:'idle'});

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus({type: 'idle'});
    try {
      await signup({ username, email, password });
      setStatus({ type: 'success', msg: 'Compte créé avec succès !' });
      setUsername(''); setEmail(''); setPassword('');
    } catch (err: any) {
      setStatus({ type: 'error', msg: err?.message ?? 'Erreur inconnue.' });
    }
  }

  return (
    <form noValidate onSubmit={onSubmit} aria-label="Formulaire d'inscription">
      <div style={{display:'grid', gap:12}}>
        <div>
          <label htmlFor="username">Nom d'utilisateur</label><br/>
          <input
            id="username"
            name="username"
            type="text"
            value={username}
            onChange={e=>setUsername(e.target.value)}
            placeholder="jdupont"
            required
            style={{width:'100%', padding:8}}
          />
        </div>
        <div>
          <label htmlFor="email">E-mail</label><br/>
          <input
            id="email"
            name="email"
            type="email"
            value={email}
            onChange={e=>setEmail(e.target.value)}
            placeholder="jean.dupont@example.com"
            required
            style={{width:'100%', padding:8}}
          />
        </div>
        <div>
          <label htmlFor="password">Mot de passe</label><br/>
          <input
            id="password"
            name="password"
            type="password"
            value={password}
            onChange={e=>setPassword(e.target.value)}
            placeholder="Au moins 6 caractères"
            required
            minLength={6}
            style={{width:'100%', padding:8}}
          />
        </div>

        <button type="submit" style={{padding:'10px 14px'}}>
          Créer mon compte
        </button>

        {status.type === 'success' && (
          <div role="alert" style={{color:'green'}}>{status.msg}</div>
        )}
        {status.type === 'error' && (
          <div role="alert" style={{color:'crimson'}}>{status.msg}</div>
        )}
      </div>
    </form>
  );
};


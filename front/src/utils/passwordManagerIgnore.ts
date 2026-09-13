export const passwordManagerIgnoreProps = {
  autoComplete: 'off',
  'data-1p-ignore': true,
  'data-lpignore': 'true',
  'data-bwignore': 'true',
  'data-form-type': 'other',
} as const;

const credentialFieldNames = new Set([
  'email',
  'password',
  'confirmPassword',
  'oneTimeCode',
  'oldPassword',
  'newPassword',
  'newPasswordConfirmation',
]);

const credentialAutocomplete = new Set([
  'username',
  'email',
  'current-password',
  'new-password',
  'one-time-code',
]);

const isCredentialInput = (input: HTMLInputElement) => {
  if (input.type === 'password' || input.type === 'email') {
    return true;
  }

  if (credentialAutocomplete.has(input.autocomplete)) {
    return true;
  }

  return credentialFieldNames.has(input.name);
};

export const releasePasswordManager = () => {
  if (document.activeElement instanceof HTMLElement) {
    document.activeElement.blur();
  }

  document.querySelectorAll('input').forEach(node => {
    if (!(node instanceof HTMLInputElement) || !isCredentialInput(node)) {
      return;
    }

    node.setAttribute('data-bwignore', 'true');
    node.setAttribute('data-1p-ignore', 'true');
    node.setAttribute('data-lpignore', 'true');
    node.setAttribute('data-form-type', 'other');
    node.setAttribute('autocomplete', 'off');
  });
};

export const releasePasswordManagerBeforeClose = () => {
  releasePasswordManager();

  return new Promise<void>(resolve => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => resolve());
    });
  });
};

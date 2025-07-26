import crypto from 'crypto';

export const generateOneTimeCode = () => {
  let code;
  do {
    const randomBytes = crypto.randomBytes(4);
    code = randomBytes.readUInt32BE(0) % 1000000;
  } while (code < 100000);
  return code;
};

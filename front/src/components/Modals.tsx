import { FeedbackModal } from '~/features/footer/FeedbackModal';
import { LoginModal } from '~/features/header/LoginModal';
import { SignUpModal } from '~/features/header/SignUpModal';

export const Modals = () => {
  return (
    <>
      <LoginModal />
      <SignUpModal />
      <FeedbackModal />
    </>
  );
};

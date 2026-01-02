import FeedbackModal from '~/features/footer/FeedbackModal';
import LoginModal from '~/features/header/LoginModal';
import SignUpModal from '~/features/header/SignUpModal';

const Modals = () => {
  return (
    <>
      <LoginModal />
      <SignUpModal />
      <FeedbackModal />
    </>
  );
};

export default Modals;

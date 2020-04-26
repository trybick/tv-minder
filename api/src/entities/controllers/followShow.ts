import { Request, Response } from 'express';
import User from 'models/user';

export const createFollow = async (req: Request, res: Response) => {
  const requestingUserId = res.locals.userId;
  const showData = { name: req.body.name, externalId: req.body.externalId };

  User.findOneAndUpdate(
    { _id: requestingUserId },
    { $push: { followedShows: showData } },
    (err, success) => {
      if (err) {
        res.status(500).json({
          error: err,
        });
      } else {
        console.log(success);
        res.status(200).json({ message: 'Follow added.' });
      }
    }
  );
};

// export const getFollows = async (req: Request, res: Response) => {
//   await Show.find()
//     .then((shows) => {
//       res.json(shows);
//     })
//     .catch((err: Error) => {
//       res.status(500).json({ message: err.message });
//     });
// };

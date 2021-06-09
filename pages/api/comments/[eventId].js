import {MongoClient} from 'mongodb'
import {getAllDocuments, connectDatabase, insertDocument} from "../../../helpers/db-util";

async function handler(req, res) {
  const eventId = req.query.eventId;

  let client;

  try {
    client = await connectDatabase();
  } catch (error) {
    res.status(500).json({message: "failed to connect database"});
    return
  }

  if (req.method === 'POST') {
    const {email, name, text} = req.body;
    const newComment = {
      "email": email,
      "name": name,
      "text": text,
      "eventId": eventId
    }

    let result;
    try {
      result = await insertDocument(client, 'comments', newComment);
      newComment.id = result.insertedId;

      res.status(201).json({
        message: "added comment.",
        comment: newComment
      });
    } catch (error) {
      res.status(500).json({message: "failed to insert into database"});
    }
  } else {
    try {
      const documents = await getAllDocuments(
        client,
        'comments',
        { _id: -1 },
        { eventId: eventId }
      );
      res.status(200).json({comments: documents});
    } catch (error) {
      res.status(500).json({message: "getting comments failed"});
    }
  }
  client.close();
}

export default handler;

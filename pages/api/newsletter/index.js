import {connectDatabase, insertDocument} from "../../../helpers/db-util";

async function handler(req, res) {
  if (req.method === 'POST') {
    const userEmail = req.body.email;
    let client;

    try {
      client = await connectDatabase();
    } catch (error) {
      res.status(500).json({message: "failed to connect database"});
      return
    }

    try {
      await insertDocument(client, 'newsletter', {email: userEmail});
      client.close();
    } catch (error) {
      res.status(500).json({message: "failed to insert into database"});
      return
    }
    res.status(201).json({message: "signed up!"});
  }
}

export default handler;

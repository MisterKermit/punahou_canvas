import express, { Express, Request, Response } from 'express';

const app: Express = express();
const port = process.env.PORT || 3000;

app.get("/", (_req: Request, res: Response) => {
    res.send("It works");
});

app.listen(port, () => {
    console.log(`Server starting at http://localhost:${port}`);
});


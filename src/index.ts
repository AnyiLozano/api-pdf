import { Response, Request } from 'express';
import fs from "fs";

const pdf = require("html-pdf");

export default async(req: Request, res: Response) => {
  const name: string = typeof req.query.name === "string" ? req.query.name : "";
  const type = typeof req.query.type === "string" ? req.query.type : "";
  const id = typeof req.query.id === "string" ? req.query.id : "";

    const html = fs.readFileSync(__dirname + "/views/index.html", "utf8");

    const reHtml = html.replace('{{userName}}', name)
                       .replace('{{document_type}}', type)
                       .replace('{{document}}', id);

    pdf.create(reHtml, {
        "type": "PDF",
        "renderDelay": 2000,
        "orientation": "landscape",
        "base": "file:///" + __dirname + "\\views\\images\\",
    })
        .toStream((err: any, stream: any) => {
            //    stream.pipe(fs.createWriteStream('../pdf/certification.pdf'))
            if (err) {
                return res.send({
                    status: 500,
                    msg: "error"
                })
            } else {
                res.statusCode = 200;

                stream.on('end', () => {
                    return res.end();
                })

                stream.pipe(res);
            }
        })
}


// const Server = () => {
//   router.get('/', (req: Request, res: Response) => {
//     console.log(req.params)
//     res.json(req.params)
//   })
// }

// export default Server;
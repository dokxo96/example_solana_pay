// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { Connection, PublicKey, SystemProgram, Transaction } from '@solana/web3.js';
import type { NextApiRequest, NextApiResponse } from 'next'

//estructura de datos para el get
type GetData = {
  label: string
  icon:String
}

//metodo get que nos regresara los datos de la trasnsaccion 
function get(req:NextApiRequest,res:NextApiResponse<GetData>){

  const label ="Example solana pay ";
  const icon ="https://solana.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Flogotype.e4df684f.svg&w=384&q=75";

  res.status(200).send({label,icon});

}


type PostData = {
  transaction: string
  message:String
}
async function   post(req:NextApiRequest, res:NextApiResponse<PostData>) 
{
  //Creamos una nueva conección
  const connection = new Connection("https://api.devnet.solana.com");
  //obtenermos el ultimo hash del bloque 
 const bh =await connection.getLatestBlockhash();
  //recuperamos la account que genera la llamada de tipo post
  const accountField=req.body?.account;
  if(!accountField) throw new Error(`No account field''`);
  const sender = new PublicKey(accountField);

//Contruimos el payload de la transaccion 
const ix = SystemProgram.transfer({
  //Sender: la parsona que pagara la transaccion
  fromPubkey: sender,
  //toPublicKey: la llave publica de la direccion destino que recibirá los fondos
  toPubkey: new PublicKey("2DL7TkTJXaZHY7NbYHYWje1pbufF3mpbtLc1V26WFGiM"),
  //lamports: la cantidad que se desea pagar 
  lamports: 133700000
});

//Se genera la nueva transaccion
let transaction = new Transaction();
// Se agrega el payload a la transacción 
transaction.add(ix);
transaction.recentBlockhash=bh.blockhash;
transaction.feePayer=sender;
//Se serializa la transacción
transaction = Transaction.from(transaction.serialize({
  verifySignatures: false,
  requireAllSignatures: false,
}));
 
 // Se vuelve a serializar dentro de una nueva variable 
 const serializedTransaction = transaction.serialize({
  verifySignatures: false,
  requireAllSignatures: false,
});
//Se encripta en base64
const base64Transaction = serializedTransaction.toString('base64');
const message= "Solana pay's example  by dokxo"; 

 //Se resuelve la petición 
 res.status(200).send({ transaction: base64Transaction, message });
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<GetData | PostData>
) {
  //SI la peticion es de tipo get 
  if(req.method=="GET"){
    get(req,res);
  }
  //Si la peticion es de tipo se ejecuta el metodo post 
  else if(req.method=="POST"){
  post(req,res);
  }
 
}

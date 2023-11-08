import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";



//DB接続に失敗しました
const prisma = new PrismaClient();

export async function main(){
    try{
    await prisma.$connect()
    }catch(err){
        return Error("DB接続に失敗しました")
    }
}



//Blog詳細記事取得用API
export const GET = async (req : Request,res :NextResponse) => {
    try{
        const id:number = parseInt (req.url.split("/blog/")[1]); 
        await main();
         const post = await prisma.post.findFirst({where:{id}})
        return NextResponse.json({message:"Success",post},{status:200})
    }catch(err){
        return NextResponse.json({message:"Error"},{status:500});
    }finally{
        await prisma.$disconnect();
    }
}



//ブログ編集用API
export const PUT = async (req:Request,res:NextResponse)=> {
    try{

        const id:number = parseInt (req.url.split("/blog/")[1]);
        const {title,description,image} = await req.json(); 

        await main();

        const post = await prisma.post.update({data:{title,description,image},
                                                    where:{id},
        })
        return NextResponse.json({message:"Success",post},{status:201});
    }catch(err){
        return NextResponse.json({message:"Error"},{status:500});
    }finally{
        await prisma.$disconnect();
    }
}


//ブログ削除用のAPI
export  const DELETE = async (req:Request,res:NextResponse) => {
    try{

        const id:number = parseInt (req.url.split("/blog/")[1]);
        await main();
        const post = await prisma.post.delete({where:{id},});
        return NextResponse.json({message:"Success",post},{status:200});
    }catch(err){
        return NextResponse.json({message:"Error"},{status:500});
    }finally{
        await prisma.$disconnect();
    }
}

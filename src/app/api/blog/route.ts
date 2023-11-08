import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";



//DB接続用の関数
const prisma = new PrismaClient();

export async function main() {
    try{
        await prisma.$connect();
    }catch(err){
        return Error("DB接続に失敗しました")
    }
}



//全記事取得用のAPI
export const GET = async (req:Request,res:NextResponse) => {
    try{
        await main()
        const posts = await prisma.post.findMany();
        return NextResponse.json({message:"Success",posts},{status:200});
    }catch(err){
        return NextResponse.json({message:"Error"},{status:500});
    }finally{
        await prisma.$disconnect();
    }
    // console.log("GET");

}




//ブログ投稿用のAPI
export const POST = async (req:Request,res:NextResponse) => {
    try{

            const {title,description,image} = await req.json();

        await main();
        const post = await prisma.post.create({data:{title,description,image}}); 
        //title,description,imageのデータってどこにはいってるんだっけ？→reqの中に入ってます。だからreqの中のdata取りに行きます
        
        return NextResponse.json({message:"Success",post},{status:201});
    }catch(err){
        return NextResponse.json({message:"Error"},{status:500});
    }finally{
        await prisma.$disconnect();
    }
    // console.log("GET");

}
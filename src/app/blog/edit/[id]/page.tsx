"use client"

import { useRouter } from 'next/navigation';
import React, { useEffect, useRef } from 'react'
import toast, { Toaster } from 'react-hot-toast';


const editPost = async (title:string | undefined,
                        description: string | undefined,
                        image: string | undefined,
                        id: number ) => {
    const res = await fetch(`http://localhost:3000/api/blog/${id}`,{
        method:"PUT",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify({title,description,image,id}),
    });
    return res.json();
    
}

//homeで編集ボタンを押した時にinputとtextAreaに編集前の記事を表示させておくための関数
const getBlogById = async (id : number) => {
    const res = await fetch(`http://localhost:3000/api/blog/${id}`);
    const data = await res.json();

    // //console.log()デバッグ
    // console.log(data);

//return で返すのはres.json()の中のpost情報
    return data.post;
    //これをuseEffectで表示させる

};





const EditPost = ({params}:{params :{id:number}}) => {
    //ここの({params}:{params :{id:number}})はnextjs13の記法だとShincodeさんは言ってました
    const router = useRouter();
    const titleRef = useRef<HTMLInputElement | null>(null);
    const descriptionRef = useRef<HTMLTextAreaElement | null>(null);
    const imageRef = useRef<HTMLTextAreaElement | null>(null);

    const handleSubmit = async (e:React.FormEvent) => {
        e.preventDefault();

        // console.log(titleRef.current?.value,
        //             descriptionRef.current?.value,
        //             imageRef.current?.value);
        //入力したデータはここで確認したコンソールに表示されているので、
        //データベースにPOSTする関数を書くそこで出てくるのがeditPost()
        toast.loading("編集中です・・・・",{id:"1"});
        await editPost(titleRef.current?.value,
                       descriptionRef.current?.value,
                       imageRef.current?.value,
                       params.id);

        toast.success("編集に成功しました",{id:"1"});   
        
        router.push("/");
        router.refresh();

    }

    useEffect(()=>{
        //getBlogId(params.id)したら.thenメソッドで繋いであげる
        getBlogById(params.id).then((data)=>{
            //それぞれのdataの中身が存在しない可能性があるということで赤線出てしまうので、
            //if{}の中に入れてあげる
            if(titleRef.current && descriptionRef.current && imageRef.current){

                titleRef.current.value       = data.title;
                descriptionRef.current.value = data.description;
                imageRef.current.value       = data.image;
                // console.log(data);debug
            }
        }).catch(err => {
            toast.error("エラーが発生しました",{id:"1"})
        }) ;
    },[]);


  return (
    <>
    <Toaster />
  <div className="w-full h-screen m-auto flex my-4 bg-blue-300">
    <div className="flex flex-col justify-center items-center m-auto">
      <p className="text-2xl text-slate-200 font-bold p-3">ブログの編集 🚀</p>
      <form onSubmit={handleSubmit}>
        <input
        ref={titleRef}
          placeholder="タイトルを入力"
          type="text"
          className="rounded-md px-4 w-full py-2 my-2"
        />
        <textarea
        ref={descriptionRef}
          placeholder="記事詳細を入力"
          className="rounded-md px-4 py-2 w-full my-2"
        ></textarea>
        <textarea
        ref={imageRef}
          placeholder="imageURLを入力"
          className="rounded-md px-4 py-2 w-full my-2"
        ></textarea>
        <button className="font-semibold px-4 py-2 shadow-xl bg-slate-200 rounded-lg m-auto hover:bg-slate-100">
          更新
        </button>
        <button className="ml-2 font-semibold px-4 py-2 shadow-xl bg-red-400 rounded-lg m-auto hover:bg-slate-100">
          削除
        </button>
      </form>
    </div>
  </div>
</>
  )
}

export default EditPost

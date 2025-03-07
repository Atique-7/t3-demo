import React, { useRef, useState } from "react";
import Image from "next/image";
import { TicketX, Upload, X } from "lucide-react";
import { uploadCarImage, uploadImage } from "@/lib/appwrite";
import loader from "../../public/assets/t3-loader.gif";
import { ImageObj } from "@/lib/definitions";

type Props = {};

export default function ImageCard({ type, images, setImages }: any) {
  const [imageUrl, setImageUrl] = useState("");
  const [imageUploaded, setImageUploaded] = useState(false);
  const [showLoading, setShowLoading] = useState(false);

  const hiddenFileInput = useRef(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (hiddenFileInput.current) {
      (hiddenFileInput.current as HTMLInputElement).click();
    } else {
      console.error("hiddenFileInput is null");
    }
  };

  const handleChange = async (e: any) => {
    const fileUploaded = e.target.files?.[0];
    console.log(fileUploaded);

    if (fileUploaded) {
      setShowLoading(true);
      await uploadImage(fileUploaded).then((res: any) => {
        console.log("UPLOADED RES - ", res);
        setImageUrl(res.thumbnailUrl);
        setImageUploaded(true);
        setShowLoading(false);
        setImages([
          ...images,
          {
            imageType: type,
            thumbnailURL: res.thumbnailUrl,
            imageURL: res.ImageUrl,
          },
        ]);
      });
    }
  };

  const removeImg = () => {
    console.log("Removing");
    setImageUploaded(false);
    setImageUrl("");

    let findIndex = images.findIndex(
      (image: ImageObj) => image.imageType == type
    );

    let arrayFirstHalf = images.slice(0, findIndex);
    let arraySecondHalf = images.slice(findIndex + 1);

    setImages([...arrayFirstHalf, ...arraySecondHalf]);
  };

  if (imageUploaded) {
    // return (
    //   <div className="relative transition ease-in-out flex justify-around rounded-xl p-4 w-full h-32 border-2 border-red-500 text-red-500 overflow-hidden">
    //     <Image
    //       src={imageUrl}
    //       alt=""
    //       fill={true}
    //       style={{ objectFit: "cover", zIndex: 0 }}
    //     />
    //     <div className="flex flex-col text-sm h-full justify-between w-full z-10">
    //       <button className="flex w-full justify-end" onClick={removeImg}>
    //         <X />
    //       </button>
    //     </div>
    //   </div>
    // );
    return (
      <div className="relative transition ease-in-out flex justify-around rounded-xl p-4 w-full h-32 border-2 border-red-500 text-red-500 overflow-hidden">
        {imageUrl ? (
          <Image
            src={imageUrl} // Now a valid URL string
            alt="Uploaded Image"
            fill
            style={{ objectFit: "cover", zIndex: 0 }}
          />
        ) : (
          <p>Loading image...</p>
        )}
        <div className="flex flex-col text-sm h-full justify-between w-full z-10">
          <button className="flex w-full justify-end" onClick={removeImg}>
            <X />
          </button>
        </div>
      </div>
    );
  } else {
    return (
      <div
        className={`transition ease-in-out flex justify-end rounded-xl p-1 w-full h-32 border-2 border-red-500 text-red-500`}
      >
        {showLoading ? (
          <div className="flex flex-col text-sm h-full justify-center w-full items-center">
            <Image
              src={loader}
              alt=""
              // fill={true}
              style={{ objectFit: "fill", zIndex: 0 }}
              height={100}
              width={100}
            />
          </div>
        ) : (
          <div className="flex flex-col text-sm h-full justify-center w-full">
            <div className="flex flex-row h-fit w-full">
              <div className="flex justify-center text-center lg:text-left items-center w-full">
                {type}
              </div>
            </div>
            <div className="flex flex-col justify-center items-center self-center mt-2">
              <button
                className=" text-base lg:text-xl border-2 p-2 rounded-full border-white mb-2"
                onClick={handleClick}
              >
                <Upload />
              </button>

              <input
                type="file"
                ref={hiddenFileInput}
                className="hidden"
                onChange={handleChange}
              />
            </div>
          </div>
        )}
      </div>
    );
  }
}

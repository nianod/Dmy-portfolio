import { useEffect, useState } from "react";
import blog from "./Ui/blogcard";

const blogPosts = [
  {
    image: "/Screenshot 2025-05-22 010859.png",
    title: "WebSockets and REST APIs Explained",
    link: "https://blogspot.com",
  },
  {
    image: "/Devops.png",
    title: "What DevOps Really Means in Modern Engineering",
    link: "https://medium.com",
  }
];

const Blogs = () => {
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    let currentIndex = 0;
    const typingSpeed = 10;
    const type = () => {
      if (currentIndex <= blog.post.length) {
        setDisplayedText(blog.post.substring(0, currentIndex));
        currentIndex++;
        setTimeout(type, typingSpeed);
      }
    };
    type();
  }, []);

  return (
    <div data-aos="zoom-in-left" className="py-6 flex flex-col items-center mt-10 pb-25">
      <h2 className="text-4xl font-bold text-blue-400 mb-2">My Blogs</h2>
      <div className="w-24 h-1 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full mx-auto" />
      <p className="text-white max-w-xl text-center mt-5">{displayedText}</p>

       
      <div className="flex flex-row flex-wrap justify-center gap-6 mt-10 w-full px-4">
        {blogPosts.map((post, index) => (
          <div key={index} className="p-6 bg-black border border-yellow-600 rounded-lg shadow-lg w-full md:w-1/2 lg:w-1/3 xl:w-1/4 max-w-2xl">
            <img src={post.image} alt="Blog Cover" className="w-full rounded mb-4" />
            <h3 className="text-2xl font-bold text-white text-center">
              {post.title}
            </h3>
            <button className="text-white bg-blue-800 p-2 rounded-2xl cursor-pointer block mx-auto mt-4">
              <a href={post.link} target="_blank" rel="noopener noreferrer">
                Explore Blog
              </a>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Blogs;

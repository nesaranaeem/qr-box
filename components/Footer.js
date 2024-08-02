import { FaGithub, FaFacebook, FaInstagram, FaHeart } from "react-icons/fa";
import { useLanguage } from "../contexts/LanguageContext";

export default function Footer() {
  const { content } = useLanguage();

  return (
    <footer className="bg-gray-800 text-white py-4 mt-8">
      <div className="container mx-auto px-4 flex flex-col items-center">
        <div className="flex items-center mb-2">
          <span>{content.madeWith} </span>
          <FaHeart className="text-red-500 mx-1" />
          <span>
            {content.by} {content.authorName}
          </span>
        </div>
        <div className="flex space-x-4">
          <a
            href="https://github.com/nesaranaeem"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-300"
          >
            <FaGithub className="text-xl" />
          </a>
          <a
            href="https://facebook.com/nesaranaeem"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-300"
          >
            <FaFacebook className="text-xl" />
          </a>
          <a
            href="https://instagram.com/nesaranaeem"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-300"
          >
            <FaInstagram className="text-xl" />
          </a>
        </div>
      </div>
    </footer>
  );
}

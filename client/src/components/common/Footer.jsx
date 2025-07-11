function Footer() {
  return (
    <footer className="bg-gray-800 border-t border-gray-700 text-gray-400 text-center py-8">
      <p className="text-sm">
        © {new Date().getFullYear()} BlogSite. All rights reserved.
      </p>
    </footer>
  );
}

export default Footer;

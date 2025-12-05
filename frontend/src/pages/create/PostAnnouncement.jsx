

import React from "react";

const PostAnnouncement = () => {
  return (
    <section className="container mx-auto px-4 py-12 max-w-lg">
      <h1 className="text-3xl font-semibold mb-6">Post Announcement</h1>
      <form className="space-y-4">
        <input type="text" placeholder="Title" className="w-full p-3 border rounded"/>
        <textarea placeholder="Announcement Details" className="w-full p-3 border rounded"></textarea>
        <button type="submit" className="w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700">Post</button>
      </form>
    </section>
  );
};

export default PostAnnouncement;

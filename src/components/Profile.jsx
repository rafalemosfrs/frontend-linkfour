function Profile({ name, bio, avatar }) {
  return (
    <div className="mb-8 text-center animate-fade-in">
      <img
        src={avatar}
        alt={name}
        className="mx-auto mb-4 h-24 w-24 rounded-full border-4 border-white shadow-lg"
      />
      <h1 className="mb-2 text-2xl font-bold text-gray-800 dark:text-white">
        {name}
      </h1>
      <p className="text-gray-600 dark:text-gray-300">{bio}</p>
    </div>
  );
}

export default Profile;
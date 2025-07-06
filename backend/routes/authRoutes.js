// ✅ Google Login Route
router.post('/google', async (req, res) => {
  const { email, name, picture } = req.body;

  try {
    let user = await User.findOne({ email });

    if (!user) {
      user = new User({
        email,
        name,
        picture,
        password: 'google-oauth', // dummy password
      });
      await user.save();
    }

    const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.status(200).json({ token });
  } catch (err) {
    console.error('❌ Google Login Error:', err);
    res.status(500).json({ message: 'Google login failed' });
  }
});

app.post("/token", (req, res) => {
    const { refreshToken } = req.cookies;
  
    if (!refreshToken || !refreshTokens.includes(refreshToken)) {
      return res.status(403).json({ message: "Your credentials are incorrect" });
    }
  
    jwt.verify(refreshToken, REFRESH_TOKEN_SECRET, (err, user) => {
      if (err)
        return res
          .status(403)
          .json({ message: "Your session has expired. Please log in again." });
  
      const accessToken = jwt.sign(
        { username: user.username },
        ACCESS_TOKEN_SECRET,
        { expiresIn: "15m" }
      );
      const newRefreshToken = jwt.sign(
        { username: user.username },
        REFRESH_TOKEN_SECRET,
        { expiresIn: "7d" }
      );
  
      refreshTokens = refreshTokens.filter((token) => token !== refreshToken);
      refreshTokens.push(newRefreshToken);
  
      res.cookie("refreshToken", newRefreshToken, {
        httpOnly: true,
        secure: false, // Geliştirme için false, üretimde true olmalı
        sameSite: "Strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 gün
      });
  
      res.json({ accessToken });
    });
  });
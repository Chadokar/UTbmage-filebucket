const { google } = require("googleapis");

const db = require("../db");

// OAuth2 client for Google APIs
const client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URL
);

// getChannel function to get channel details
const getChannel = async (req, res) => {
  try {
    // get channel details from the database
    const channel = await db("channels")
      .select("*")
      .where({ yt_channel_id: req.user.yt_channel })
      .first();
    if (!channel) {
      throw new Error("Channel not found");
    }

    // set the credentials for the OAuth2 client
    client.setCredentials({
      access_token: req.user.access_token,
      refresh_token: req.user.refresh_token,
    });

    // create a new youtube instance
    const youtube = google.youtube({
      version: "v3",
      auth: client,
    });

    // fetch channel details from the YouTube API
    const response = await youtube.channels.list({
      part: "snippet,statistics,contentDetails",
      id: channel.yt_channel_id,
    });
    res.status(200).json({ channel, response: response.data });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// updateChannel function to update channel details : description, title, keywords, defaultLanguage, defaultTab, showRelatedChannels, showBrowseView, featuredChannelsTitle, featuredChannelsUrls, unsubscribedTrailer, profileColor
const updateChannel = async (req, res) => {
  try {
    const id = req.user.yt_channel;
    if (!id) {
      throw new Error("Channel ID is required");
    }

    // set the credentials for the OAuth2 client
    client.setCredentials({
      access_token: req.user.access_token,
      refresh_token: req.user.refresh_token,
    });

    // create a new youtube instance
    const youtube = google.youtube({
      version: "v3",
      auth: client,
    });

    // update channel details using the YouTube API
    // const response = await youtube.channels.update({
    //   part: ["brandingSettings"],
    //   requestBody: {
    //     brandingSettings: {
    //       channel: {
    //         // title: req.body.title,
    //         description: req.body.description,
    //       },
    //     },
    //     id,
    //   },
    // });

    const resp = await youtube.channels.update({
      part: ["localizations"],
      requestBody: {
        localizations: {
          ["en_US"]: {
            title: req.body.title,
            description: req.body.description,
          },
        },
        id,
      },
    });

    // console.log("response : ", response);

    // update the database with the new description
    await db("channels")
      .where({ yt_channel_id: id })
      .update({
        ...req.body,
      })
      .returning("*")
      .then((res) => res[0]);

    res.status(200).json({ success: true, resp });
  } catch (error) {
    if (error.code < 400) res.status(500);
    res.json({ error: error.message || error.detail || error, success: false });
  }
};

// get subcribers count
const getSubscribers = async (req, res) => {
  try {
    // get channel details from the database
    const channel = await db("channels")
      .select(["yt_channel_id"])
      .where({ id: req.user.yt_channel })
      .first();
    if (!channel) {
      throw new Error("Channel not found");
    }

    // set the credentials for the OAuth2 client
    client.setCredentials({
      access_token: req.user.access_token,
      refresh_token: req.user.refresh_token,
    });

    // create a new youtube instance
    const youtube = google.youtube({
      version: "v3",
      auth: client,
    });

    // fetch subscribers count from the YouTube API
    const response = await youtube.channels.list({
      part: ["statistics"],
      id: channel.yt_channel_id,
    });
    res.status(200).json({ channel, response: response.data });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// get youtube videos
const getVideos = async (req, res) => {
  try {
    // set the credentials for the OAuth2 client
    client.setCredentials({
      access_token: req.user.access_token,
      refresh_token: req.user.refresh_token,
    });

    // create a new youtube instance
    const youtube = google.youtube({
      version: "v3",
      auth: client,
    });

    // fetch authorized user's videos from the YouTube API
    const response = await youtube.search.list({
      part: ["snippet"],
      forMine: true,
      type: "video",
    });

    // await response.data.items.forEach(async (item) => {
    //   if (item.snippet) {
    //     await db("videos").insert({
    //       title: item.snippet.title,
    //       description: item.snippet.description,
    //       yt_channel: req.user.yt_channel,
    //       url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
    //       last_update_by: req.user.id,
    //     });
    //   }
    // });

    // https://www.youtube.com/watch?v=${item.snippet.resourceId.videoId}
    // https://www.youtube.com/watch?v=${item.snippet.id.videoId}
    res.status(200).json({ channel, response: response.data });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { getChannel, updateChannel, getSubscribers, getVideos };

/*

{
    "error": "Failing row contains (1, lucky's_4s, null, luckys4s-7956@pages.plusgoogle.com,
     $2a$10$/FkSPNqzxL7Oz7Ymom8bUubZ32NPVWgVsUX7uwlvs6AhNdOHuNo/G, null, null, 117623104581668080370,
      UCo_TQADd2JM6zo1BsArdCsQ, user, ya29.a0AXooCgvD-gIMFcfW2Ue1ipMl4rK87g0QXncIqJj9BCmrF_U3MxiMiBSj8...,
       1//0ggFnrd3JMv9dCgYIARAAGBASNwF-L9Ir4K8cs6-HCYkxTDqHDexAgUFzsBuW..., 2024-07-20 17:40:37.352396+05:30,
        2024-07-20 17:40:37.352396+05:30, ca0a7d4c-9e7d-4225-9020-2d79a320b763).",
    "message": "insert into \"users\" (\"access_token\", \"email\", \"first_name\", \"last_name\", \"password\", \"profile_id\", \"refresh_token\", \"yt_channel\") values ($1, $2, $3, DEFAULT, $4, $5, $6, $7) returning \"id\", \"email\", \"first_name\", \"last_name\", \"profile_id\", \"yt_channel\" - null value in column \"last_name\" of relation \"users\" violates not-null constraint",
    "success": false
}

*/

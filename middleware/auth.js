const islogin = async(req, res, next) => {
    try {
        if (req.session.user_id) {} else {
            res.redirect('signin');
        }
        return next();

    } catch (err) {
        console.log(err.message);
    }
};

const islogout = async(req, res, next) => {
    try {

        if (req.session.user_id) {
            res.redirect('startride');
        }
        return next();

    } catch (err) {
        console.log(err.message);
    }
};

module.exports = {
    islogin,
    islogout
};
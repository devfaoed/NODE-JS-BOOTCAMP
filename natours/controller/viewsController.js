export const getOverview = (req, res) => {
    res.status(200).render("overview", {title: "all tours"})
  }

export const getTour =  (req, res) => {
    res.status(200).render('tour', { title: 'the forest hicker tour' });
  }
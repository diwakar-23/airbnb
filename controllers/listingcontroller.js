const Listing = require("../models/listing");
module.exports.index =async (req, res,next) => {
  // Listing.find({}).then((res) =>{
  //   console.log(res);
  // });
  const allListings = await Listing.find({});
  // console.log(allListings)
  res.render("listings/index.ejs", { allListings });
 };

 module.exports.newFormrender = (req,res)=>{
    res.render("listings/new.ejs");
};
module.exports.showListing = async(req,res,next)=>{
    const {id} = req.params;
    
    const listing = await Listing.findById(id)
    .populate({
        path:"reviews",
        populate : {path:"author"},
})
    .populate("owner");
    if(!listing){
        req.flash("error","you are search for listing not found")
        return res.redirect("/listings")
    }
    
    res.render("listings/show.ejs",{listing})
};

module.exports.createListing = async(req,res,next)=>{
    let url = req.file.path;
    let filename = req.file.filename;
let newlisting = new Listing(req.body.listing);
newlisting.owner = req.user._id;
newlisting.image = {url,filename}
if(!req.body.listing){
    throw new ExpressError(400,"send valid data for listing");
}
await newlisting.save();
req.flash("success","New listing created !");
res.redirect("/listings");
};

module.exports.editListing = async(req,res,next)=>{
        // console.log(req.body);
    const {id} = req.params;
    const listing = await Listing.findById(id);
    let listingOriginalUrl = listing.image.url;
    listingOriginalUrl.replace("/upload","/upload/w_250");
    res.render("listings/edit.ejs",{listing,listingOriginalUrl});
};

module.exports.updateListing = async (req, res,next) => {
  let { id } = req.params;
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

  if(typeof req.file !=='undefined'){
 let url = req.file.path;
    let filename = req.file.filename;
    listing.image = {url,filename}
    await listing.save();
    }


  req.flash("success","Listing Updated");
  res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res,next) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
  req.flash("success"," Listing deleted");
  res.redirect("/listings");
};


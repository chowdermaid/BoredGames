import React from 'react';

const divStyling = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'Center',
  alignItems: 'Center',
  width: '60%',
  margin: '0 auto',
};

function FAQ() {
  return (
    <div style={divStyling}>
      <h2>Frequently Asked Questions</h2>
      <p>
        Hello, in this section we will discuss the extra features that bored
        games has. We've got Secret Santa (Gifting), Sale Items and Coupons!. An
        admin can view sales analytics to see how close they are to becoming the
        Monopoly man.
      </p>
      <h3>Where do the coupons come from?</h3>
      <p>
        Coupons come from the admin creating it in admin portal. These
        promotions come out in the customer's email so be sure to check your
        inbox! Admin can view all coupons in "Admin Portal -> View Coupons"
        Section.
      </p>
      <h3>You may be thinking...why board games?</h3>
      <p>
        Great question, so we were actually thinking of building a Harry
        Potter wand e-commerce website with custom wands created for each of our
        dedicated users. Unfortunately, this was not considered a legitimate
        website.. by some people. As a result, this is what we've come up with.
      </p>
      <h3>What is 'My Collection'?</h3>
      <p>
        It is a list of games that you know and enjoy playing. This is a list that you get 
        to curate to help us recommend new games that you'll love. 
      </p>
      <h3>Why are the categories and mechanics different sometimes?</h3>
      <p>
        If you are not logged in, they are the most popular categories and mechanics 
        as appear in the most popular games. If however, you are logged in, they are 
        tailored to you and the games that you like so that we can help you find more 
        games you'll love.  
      </p>
      <h3>How do you decide what games to recommend to me?</h3>
      <p>
        We do a couple of different things. First we look at other users who have similar
        preferences to you (similar quiz answers or similar games in their collection) and 
        find what games they like. We also look games that are similar to games that you like.
        We then combine that to recommend you games that you will love.   
      </p>
      <h3>Can I really buy games?</h3>
      <p>
        Unfortunately not from us at this stage. We'll get back to you when we buy a warehouse
        ...and games. 
      </p>
    </div>
  );
}

export default FAQ;

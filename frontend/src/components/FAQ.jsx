import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './CSS/FAQ.css';

const FAQ = () => {
  const [faqs, setFaqs] = useState([]);
  const [activeIndex, setActiveIndex] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [userVotes, setUserVotes] = useState({}); // Track current user's vote per FAQ

  useEffect(() => {
    document.body.classList.add('faq-body');
    return () => { document.body.classList.remove('faq-body'); };
  }, []);

  useEffect(() => {
    const fetchFAQs = async () => {
      try {
        const response = await axios.get('http://localhost:9000/api/faqs');
        setFaqs(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching FAQs:", error);
        setLoading(false);
      }
    };
    fetchFAQs();
  }, []);

  const toggleFAQ = (index) => {
    setActiveIndex(index === activeIndex ? null : index);
  };

  const submitFeedback = async (id, isHelpful) => {
    // Prevent multiple votes by checking if the user has already voted for this FAQ
    if (userVotes[id] !== undefined) return;

    try {
      // Send feedback to the server
      await axios.post(`http://localhost:9000/api/faqs/${id}/feedback`, {
        helpful: isHelpful,
      });

      // Fetch the updated FAQ data from the server to get the new vote counts
      const updatedFaqs = await axios.get('http://localhost:9000/api/faqs');
      setFaqs(updatedFaqs.data);

      // Track this FAQ as voted on by the user
      setUserVotes((prevVotes) => ({
        ...prevVotes,
        [id]: isHelpful,
      }));
    } catch (error) {
      console.error("Error submitting feedback:", error);
    }
  };

  const filteredFaqs = faqs.filter((faq) =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return <p>Loading FAQs...</p>;
  }

  return (
    <div className="faq-section">
      <h2>Frequently Asked Questions</h2>
      <div className="faq-search">
        <input
          type="text"
          placeholder="Search FAQs..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <div className="faq-list">
        {filteredFaqs.length > 0 ? (
          filteredFaqs.map((faq, index) => (
            <div 
              key={faq._id}
              className={`faq-item ${activeIndex === index ? "active" : ""}`}
            >
              <div className="faq-question" onClick={() => toggleFAQ(index)}>
                {faq.question}
                <span>{activeIndex === index ? "-" : "+"}</span>
              </div>
              {activeIndex === index && (
                <div className="faq-answer">
                  {faq.answer}
                  <div className="faq-feedback">
                    <button 
                      className={`feedback-button helpful ${userVotes[faq._id] === true ? 'clicked' : ''}`}
                      onClick={() => submitFeedback(faq._id, true)} 
                      disabled={userVotes[faq._id] !== undefined}
                    >
                      👍 Helpful ({faq.helpfulCount || 0})
                    </button>
                    <button 
                      className={`feedback-button not-helpful ${userVotes[faq._id] === false ? 'clicked' : ''}`}
                      onClick={() => submitFeedback(faq._id, false)} 
                      disabled={userVotes[faq._id] !== undefined}
                    >
                      👎 Not Helpful ({faq.notHelpfulCount || 0})
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <p>No FAQs match your search.</p>
        )}
      </div>
    </div>
  );
};

export default FAQ;

// src/Home.jsx
import React,{ Component }from 'react';
import { Link, Navigate } from 'react-router-dom';
import FAQ from "./FAQ";
import './CSS/Home.css'

class HomePage extends Component
{
    componentDidMount() { document.body.classList.add('homepg-body'); }
    componentWillUnmount() { document.body.classList.remove('homepg-body'); }

    render()
    {
        return(
            <div className="homepage">
                <h1>Welcome to Dr.PillPilot</h1>
                <p>Your trusted online medicine management system.</p>
                <SearchBar/> <FeatureButtons/> <FeaturedProducts/> <HealthTips/> 
                <InformationalVideos/> <NewsletterArchive/> <FAQ />
            </div>
        );
    }
}

class SearchBar extends Component
{
    constructor(props)
    {
        super(props);
        this.state = { change: false, };
    }
    goToSearchPage = () => { this.setState({ change: true }) }

    render()
    {
        const { change } = this.state;
        if(change) return <Navigate to="/search-medicine"> </Navigate>
        return( <button className="search-bar" onClick = {this.goToSearchPage}> Search For A Medicine </button> );
    }
}

class FeatureButtons extends Component
{
    render()
    {
        return(
            <div className="feature-buttons">
                <Link to="/dosage"><button>Dosage Calculator</button></Link>
                <Link to="/safety-checker"><button>Safety Checker</button></Link>
                <Link to="/specialists"><button>Consultation</button></Link>
            </div>
        );
    }
}

class FeaturedProducts extends Component
{
    constructor(props) 
    {
        super(props);
        this.state = { selectedTips: [] };
    }

    async componentDidMount() {
        const response = await fetch('http://localhost:9000/api/featured-meds');
        const data = await response.json();
        this.setState({ selectedTips: data });
    }

    render() {
        const { selectedTips } = this.state;
        return (
            <div className="featured-products">
                <h2>Featured Products</h2>
                {selectedTips.map((tip, index) => <p key={index}>{tip.name}: {tip.usedFor}</p>)}
            </div>
        );
    }
}

class HealthTips extends Component 
{
    constructor(props) 
    {
        super(props);
        this.state = { selectedTips: [] };
    }

    async componentDidMount() {
        const response = await fetch('http://localhost:9000/api/health-tips');
        const data = await response.json();
        this.setState({ selectedTips: data });
    }

    render() 
    {
        const { selectedTips } = this.state;
        return (
            <div className="health-tips">
                <h2>Health Tips</h2>
                {selectedTips.map((tip, index) => <p key={index}>{tip.text}</p>)}
            </div>
        );
    }
}

class InformationalVideos extends Component 
{
    constructor(props) 
    {
        super(props);
        this.state = { selectedVideo: {}, videoTitle: "" };
    }

    async componentDidMount() {
        const response = await fetch('http://localhost:9000/api/informational-videos');
        const data = await response.json();
        this.setState({ selectedVideo: data, videoTitle: data.title });
    }

    render() 
    {
        const { selectedVideo, videoTitle } = this.state;
        
        return (
            <div className="informational-videos">
                <h2>Informational Videos</h2>
                <div className="video-placeholder">
                    <iframe width="500" height="315" src={selectedVideo.url} title="Informational Video"
                        frameBorder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope" allowFullScreen />
                    <h3 style={{ color: "#005A9C" }}>{videoTitle}</h3>
                </div>
            </div>
        );
    }
}

class NewsletterArchive extends Component 
{
    constructor(props) 
    {
        super(props);
        this.state = { randomNewsletters: [] };
    }

    async componentDidMount() {
        try 
        {
            const response = await fetch('http://localhost:9000/api/newsletters');
            const newsletters = await response.json();
            console.log(response.json);

            if (Array.isArray(newsletters) && newsletters.length > 1) 
            {
                const randomIndexes = [];
                while (randomIndexes.length < 2) 
                {
                    const randomIndex = Math.floor(Math.random() * newsletters.length);
                    if (!randomIndexes.includes(randomIndex)) randomIndexes.push(randomIndex);
                }

                const randomNewsletters = randomIndexes.map(index => newsletters[index]);
                this.setState({ randomNewsletters });
            } 
            else this.setState({ randomNewsletters: newsletters }); 
        } catch (error) { console.error("There was an error fetching the newsletters!", error); }
    }

    render() {
        const { randomNewsletters } = this.state;

        if (!Array.isArray(randomNewsletters)) return <p>Error: Invalid data received.</p>;

        return (
            <div className="newsletter-archive">
                <h2>Newsletter Archive</h2>
                {randomNewsletters.length === 0 ? (
                    <p>No newsletters available</p>
                ) : (
                    randomNewsletters.map((newsletter, index) => (
                        <div key={index}>
                            <p>
                                <a href={newsletter.link} target="_blank" rel="noopener noreferrer">{newsletter.name}</a> 
                                - {newsletter.description}
                            </p>
                        </div>
                    ))
                )}
            </div>
        );
    }
}

export default HomePage;
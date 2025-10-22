// Farcaster Frame API Handler
export default function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { untrustedData } = req.body;
    
    if (!untrustedData) {
        return res.status(400).json({ error: 'Invalid frame data' });
    }

    const { buttonIndex, fid, castHash } = untrustedData;
    
    try {
        let response;
        
        switch (buttonIndex) {
            case 1: // Get Daily Horoscope
                response = generateHoroscopeResponse(fid);
                break;
            case 2: // Mint as NFT
                response = generateMintResponse(fid, castHash);
                break;
            default:
                response = generateDefaultResponse();
        }
        
        res.status(200).json(response);
    } catch (error) {
        console.error('Frame API error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

function generateHoroscopeResponse(fid) {
    const zodiacSigns = ['♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓'];
    const zodiacNames = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];
    
    // Generate horoscope based on fid and current date
    const zodiacIndex = fid % 12;
    const zodiacSign = zodiacSigns[zodiacIndex];
    const zodiacName = zodiacNames[zodiacIndex];
    
    const horoscopeMessage = generateHoroscopeMessage(zodiacIndex);
    const luckyNumber = Math.floor(Math.random() * 100) + 1;
    
    return {
        type: 'frame',
        image: `https://horoscopemint.com/api/generate-image?zodiac=${zodiacIndex}&message=${encodeURIComponent(horoscopeMessage)}&lucky=${luckyNumber}`,
        buttons: [
            {
                label: 'Mint as NFT (1 USDC)',
                action: 'post',
                target: 'https://horoscopemint.com/api/mint'
            },
            {
                label: 'Share on Farcaster',
                action: 'post',
                target: 'https://horoscopemint.com/api/share'
            }
        ],
        postUrl: 'https://horoscopemint.com/api/frame'
    };
}

function generateMintResponse(fid, castHash) {
    return {
        type: 'frame',
        image: 'https://horoscopemint.com/api/mint-image',
        buttons: [
            {
                label: 'Connect Wallet',
                action: 'post',
                target: 'https://horoscopemint.com/api/connect'
            },
            {
                label: 'View Profile',
                action: 'post',
                target: 'https://horoscopemint.com/api/profile'
            }
        ],
        postUrl: 'https://horoscopemint.com/api/frame'
    };
}

function generateDefaultResponse() {
    return {
        type: 'frame',
        image: 'https://horoscopemint.com/logo.png',
        buttons: [
            {
                label: 'Get Daily Horoscope',
                action: 'post',
                target: 'https://horoscopemint.com/api/frame'
            },
            {
                label: 'View Quests',
                action: 'link',
                target: 'https://horoscopemint.com/quest.html'
            }
        ],
        postUrl: 'https://horoscopemint.com/api/frame'
    };
}

function generateHoroscopeMessage(zodiacIndex) {
    const messages = [
        "Venus aligns with your sign today, bringing unexpected romantic opportunities. Trust your intuition when meeting new people, as cosmic forces are working in your favor.",
        "The stars suggest a deep emotional connection is forming. Be open to vulnerability and authentic communication in your relationships.",
        "Mercury's influence brings clarity to your love life. Express your feelings honestly and listen to your partner's needs with an open heart.",
        "Jupiter's influence brings financial opportunities your way. Trust your instincts when making investment decisions, but avoid impulsive spending.",
        "The cosmic alignment favors long-term financial planning. Consider diversifying your portfolio and exploring new income streams.",
        "Mars energizes your professional life today. Take initiative on projects and don't hesitate to showcase your unique talents to superiors."
    ];
    
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
    const messageIndex = (dayOfYear + zodiacIndex) % messages.length;
    
    return messages[messageIndex];
}

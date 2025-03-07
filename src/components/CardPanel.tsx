'use client'
import { useReducer } from "react";
import Card from "./Card";
import Link from "next/link";

export default function CardPanel() {
    
    const ratingReducer = (ratings:Map<string, number | null>, action:{type:string, hospitalName:string, rating:number | null}) => {
        switch(action.type) {
            case 'add': {
                const newMap = new Map<string, number | null>(ratings);
                if (action.rating===null) {
                    newMap.delete(action.hospitalName);
                    return newMap;
                } else {
                    newMap.set(action.hospitalName, action.rating);
                    return newMap;
                }
            }
            case 'remove': {
                ratings.delete(action.hospitalName);
                return new Map<string, number | null>(ratings);
            }
            default: return ratings;
        }
    }

    const [ratings, dispatchRating] = useReducer(ratingReducer, new Map<string, number | null>([["Chulalongkorn Hospital", 5], ["Rajavithi Hospital", 5], ["Thammasat University Hospital", 5]]));

    const mockCardRepo = [
        {cid: "001", name: "Chulalongkorn Hospital", image: "/img/chula.jpg"},
        {cid: "002", name: "Rajavithi Hospital", image: "/img/vajira.jpg"},
        {cid: "003", name: "Thammasat University Hospital", image: "/img/thammasat.jpg"}
    ]

    return (
        <div>
            <div style={{margin:"20px", display:"flex", flexDirection:"row",
            flexWrap:"wrap", justifyContent:"space-around", alignContent:"space-around"}}>
              {
                    mockCardRepo.map((cardItem)=>(
                        <Link href={`/hospital/${cardItem.cid}`} className="w-1/5" key={cardItem.cid}> 
                            <Card hospitalName={cardItem.name} imgSrc={cardItem.image} value={ratings.get(`${cardItem.name}`) ?? 0} 
                            onRating={(hospital:string, ratings:number | null)=>dispatchRating({type:'add', hospitalName:hospital, rating:ratings})}/>
                        </Link>
                    ))
                }
            </div>
            <div className="w-full text-xl font-medium">Rating List: {ratings.size}</div>
            {Array.from(ratings).map(([hospital, rating]) => (
                <div key={hospital} data-testid={hospital} 
                onClick={()=>{dispatchRating({type:'remove', hospitalName:hospital, rating:0});}}>
                    {hospital}: {rating}
                </div>
            ))}
        </div>
    );
}
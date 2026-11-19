import React, {useEffect, useState} from "react";
import {useParams, useSearchParams} from "react-router-dom";
import Header from "./components/Header/Header";

export function Dealers() {
  const [dealers, setDealers] = useState([]);
  const [search, setSearch] = useSearchParams();
  const state = search.get("state") || "";
  const [states, setStates] = useState([]);
  const [error, setError] = useState("");
  useEffect(() => {
    fetch("/djangoapp/get_dealers").then(r=>r.json()).then(d=>{
      setStates([...new Set(d.dealers.map(x=>x.state))].sort());
    }).catch(()=>setError("Unable to load states."));
  }, []);
  useEffect(()=>{
    fetch("/djangoapp/get_dealers"+(state?"/"+encodeURIComponent(state):""))
      .then(r=>r.json()).then(d=>setDealers(d.dealers)).catch(()=>setError("Unable to load dealers."));
  }, [state]);
  return <><Header/><main className="container py-4"><h1>Dealerships</h1><p role="alert">{error}</p>
    <label>State <select value={state} onChange={e=>setSearch(e.target.value ? {state: e.target.value} : {})}>
      <option value="">Show all</option>{states.map(s=><option key={s}>{s}</option>)}
    </select></label>
    <table className="table table-striped"><thead><tr><th>Name</th><th>City</th><th>State</th><th>Reviews</th></tr></thead>
      <tbody>{dealers.map(d=><tr key={d.id}><td><a href={"/dealer/"+d.id}>{d.full_name}</a></td><td>{d.city}</td><td>{d.state}</td>
        <td>{sessionStorage.getItem("username")?<a href={"/review/"+d.id}>Review Dealer</a>:<a href={"/dealer/"+d.id}>Read reviews</a>}</td></tr>)}</tbody></table>
  </main></>;
}

export function Dealer() {
  const {id} = useParams();
  const [dealer,setDealer]=useState(null);
  const [reviews,setReviews]=useState([]);
  const [error,setError]=useState("");
  useEffect(()=>{
    Promise.all([fetch("/djangoapp/dealer/"+id).then(r=>r.json()),fetch("/djangoapp/reviews/dealer/"+id).then(r=>r.json())])
      .then(([d,r])=>{setDealer(d.dealer);setReviews(r.reviews);})
      .catch(()=>setError("Unable to load dealer details."));
  },[id]);
  return <><Header/><main className="container py-4"><p role="alert">{error}</p>
    {dealer&&<><h1>{dealer.full_name}</h1><p>{dealer.address}, {dealer.city}, {dealer.state} {dealer.zip}</p>
      {sessionStorage.getItem("username")&&<a className="btn btn-primary" href={"/review/"+id}>Review Dealer</a>}</>}
    <h2 className="mt-4">Customer reviews</h2>
    {reviews.map((r,i)=><article className="card p-3 mb-3" key={i}><h3>{r.name}</h3><p>{r.review}</p><small>{r.car_make} {r.car_model} {r.car_year} · {r.purchase_date}</small></article>)}
  </main></>;
}

export function AddReview() {
  const {id}=useParams();
  const [cars,setCars]=useState([]);
  const [error,setError]=useState("");
  useEffect(()=>{fetch("/djangoapp/get_cars").then(r=>r.json()).then(d=>setCars(d.carModels));},[]);
  async function submit(e) {
    e.preventDefault();
    const data=Object.fromEntries(new FormData(e.target));
    data.purchase=e.target.purchase.checked;
    data.dealership=Number(id);
    await fetch("/djangoapp/get_dealers");
    const token=document.cookie.split("; ").find(c=>c.startsWith("csrftoken="))?.split("=")[1];
    const r=await fetch("/djangoapp/add_review",{method:"POST",headers:{"Content-Type":"application/json","X-CSRFToken":token},body:JSON.stringify(data)});
    const result=await r.json();
    if(!r.ok){setError(result.error);return;}
    window.location.href="/dealer/"+id;
  }
  return <><Header/><main className="container py-4"><h1>Post Review</h1><p role="alert">{error}</p>
    <form onSubmit={submit}><label>Your review<textarea className="form-control" name="review" required maxLength={4000}/></label><br/>
      <label><input type="checkbox" name="purchase"/> I purchased a car from this dealership</label><br/>
      <label>Purchase date<input className="form-control" type="date" name="purchase_date"/></label><br/>
      <label>Car make, model and year<select className="form-control" name="car_model" required>
        <option value="">Select a car</option>{cars.map(c=><option value={c.id} key={c.id}>{c.car_make__name} {c.name} {c.year}</option>)}
      </select></label><br/><button className="btn btn-primary">Submit Review</button></form>
  </main></>;
}

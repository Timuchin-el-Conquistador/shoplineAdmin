

import "@/styles/kpi-card.scss";


function KPI(props:{summary: {
    locations: number;
    staff: number;
    visitors: number;
    sessions: number;
  } | null}) {


  return (
    <div id="container">
      <div className="kpi-card orange">
        <span className="card-value">{props.summary ? props.summary.locations : 'N/A'} </span>
        <span className="card-text">Total Locations</span>
        <i className="fas fa-shopping-cart icon"></i>
      </div>

      <div className="kpi-card purple">
         <span className="card-value">{props.summary ? props.summary.staff : 'N/A'} </span>
        <span className="card-text">Total Staff</span>
        <i className="fas fa-shopping-cart icon"></i>
      </div>

      <div className="kpi-card grey-dark">
       <span className="card-value">{props.summary ? props.summary.visitors : 'N/A'} </span>
        <span className="card-text">Total Visitors</span>
        <i className="fas fa-shopping-cart icon"></i>
      </div>

      <div className="kpi-card red">
        <span className="card-value">{props.summary ? props.summary.sessions : 'N/A'} </span>
        <span className="card-text">Total Sessions</span>
        <i className="fas fa-shopping-cart icon"></i>
      </div>
    </div>
  );
}

export default KPI;

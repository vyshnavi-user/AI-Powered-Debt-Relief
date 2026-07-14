function DashboardCard({ title, value, color }) {

    return (

        <div className="col-lg-3 col-md-6 mb-4">

            <div
                className="card shadow-sm"
                style={{
                    borderLeft: `6px solid ${color}`,
                    borderRadius: "12px"
                }}
            >

                <div className="card-body">

                    <h6
                        style={{
                            color: "#555"
                        }}
                    >
                        {title}
                    </h6>

                    <h3
                        className="mt-3"
                        style={{
                            color: color
                        }}
                    >
                        {value}
                    </h3>

                </div>

            </div>

        </div>

    );

}

export default DashboardCard;
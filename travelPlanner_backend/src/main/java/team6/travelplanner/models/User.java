package team6.travelplanner.models;

import lombok.Data;
import lombok.ToString;

import javax.persistence.Column;
import javax.persistence.ElementCollection;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import java.util.Set;

@Entity
@Data
@ToString(onlyExplicitlyIncluded = true)
@Table(name = "userprofile")
public class User {
    @Id
    @GeneratedValue
    @ToString.Include
    long id;

    @Column(nullable = false, unique = true)
    @ToString.Include
    String username;

    @ToString.Include
    String password;

    @ToString.Include
    String email;

    @OneToMany
    Set<Place> likedPlaces;

    @OneToMany
    Set<Place> likedTour;

    @ElementCollection
    Set<String> keywords;

    boolean isAccountNonExpired = true;

    boolean isAccountNonLocked = true;

    boolean isCredentialsNonExpired = true;

    boolean isEnabled = true;
}
